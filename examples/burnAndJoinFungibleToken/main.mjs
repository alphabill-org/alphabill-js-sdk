import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { BurnFungibleTokenAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/BurnFungibleTokenAttributes.js';
import { JoinFungibleTokenAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/JoinFungibleTokenAttributes.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { SplitFungibleTokenAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/SplitFungibleTokenAttributes.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { TransactionPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionPayload.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
});

const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const feeCreditRecordId = new UnitIdWithType(
  sha256(signingService.publicKey),
  UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD,
);
const round = await client.getRoundNumber();

// expects that the fungible token has already been created
const unitId = new UnitIdWithType(new Uint8Array([1, 2, 3, 4, 5]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN);
const fungibleTokenType = new UnitIdWithType(new Uint8Array([1, 2, 3]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE);
/**
 * @type {IUnit<FungibleToken>|null}
 */
const token = await client.getUnit(unitId, false);

// 1. split the fungible token
const targetValue = 1n;
console.log("Original token's value before split: " + token?.data.value);
const remainingValue = token?.data.value - targetValue;
const splitTransactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.TOKEN_PARTITION,
      token?.unitId,
      new SplitFungibleTokenAttributes(
        await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
        targetValue,
        null,
        token?.data.backlink,
        fungibleTokenType,
        remainingValue,
        [null],
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId,
      },
    ),
  ),
);

// 1b. wait for transaction to finalize
await waitTransactionProof(client, splitTransactionHash);

// 2. find the token that was split, here as a hack to just take second token from list
const unitIds = await client.getUnitsByOwnerId(signingService.publicKey);
const splitTokenId = unitIds.at(1);
/**
 * @type {IUnit<FungibleToken>|null}
 */
const splitToken = await client.getUnit(splitTokenId, false);
console.log('Split token ID: ' + Base16Converter.encode(splitTokenId.bytes));
console.log('Split token value: ' + splitToken?.data.value);

// 3. check that the original tokens value has been reduced
/**
 * @type {IUnit<FungibleToken>|null}
 */
const originalTokenAfterSplit = await client.getUnit(unitId, false);
console.log("Original token's value after split: " + originalTokenAfterSplit?.data.value);

// 4. burn the split token using original fungible token as target
const burnTransactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.TOKEN_PARTITION,
      splitToken?.unitId,
      new BurnFungibleTokenAttributes(
        fungibleTokenType,
        splitToken?.data.backlink,
        originalTokenAfterSplit?.unitId,
        originalTokenAfterSplit?.data.backlink,
        splitToken?.data.backlink,
        [null],
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId,
      },
    ),
  ),
);
const transactionRecordWithProof = await waitTransactionProof(client, burnTransactionHash);

// 5. join the split token back into the original fungible token
const joinTransactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.TOKEN_PARTITION,
      originalTokenAfterSplit?.unitId,
      new JoinFungibleTokenAttributes([transactionRecordWithProof], originalTokenAfterSplit?.data.backlink, [null]),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId,
      },
    ),
  ),
);

// 5b. wait for transaction to finalize
await waitTransactionProof(client, joinTransactionHash);

// 6. check that the original tokens value has been increased
/**
 * @type {IUnit<FungibleToken>|null}
 */
const originalTokenAfterJoin = await client.getUnit(unitId, false);
console.log("Original token's value after join: " + originalTokenAfterJoin?.data.value);
