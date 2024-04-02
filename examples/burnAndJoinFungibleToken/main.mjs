import { sha256 } from '@noble/hashes/sha256';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { BurnFungibleTokenAttributes } from '../../lib/transaction/BurnFungibleTokenAttributes.js';
import { BurnFungibleTokenPayload } from '../../lib/transaction/BurnFungibleTokenPayload.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { JoinFungibleTokenAttributes } from '../../lib/transaction/JoinFungibleTokenAttributes.js';
import { JoinFungibleTokenPayload } from '../../lib/transaction/JoinFungibleTokenPayload.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/PayToPublicKeyHashPredicate.js';
import { SplitFungibleTokenAttributes } from '../../lib/transaction/SplitFungibleTokenAttributes.js';
import { SplitFungibleTokenPayload } from '../../lib/transaction/SplitFungibleTokenPayload.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '../../lib/transaction/UnitIdWithType.js';
import { UnitType } from '../../lib/transaction/UnitType.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
});

const signingService = new DefaultSigningService(Base16Converter.Decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.publicKey), SystemIdentifier.TOKEN_PARTITION);
const round = await client.getRoundNumber();

// expects that the fungible token has already been created
const unitId = new UnitIdWithType(new Uint8Array([1, 2, 3, 4, 5]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN);
const fungibleTokenType = new UnitIdWithType(new Uint8Array([1, 2, 3]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE);
const token = await client.getUnit(unitId, false);

// 1. split the fungible token
const targetValue = 1n;
console.log("Original token's value before split: " + token.data.value);
const remainingValue = token.data.value - targetValue;
const splitTransactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new SplitFungibleTokenPayload(
      new SplitFungibleTokenAttributes(
        await PayToPublicKeyHashPredicate.Create(cborCodec, signingService.publicKey),
        targetValue,
        null,
        token.data.backlink,
        fungibleTokenType,
        remainingValue,
        [null],
      ),
      token.unitId,
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: feeCreditUnitId,
      },
    ),
  ),
);

// 1b. wait for transaction to finalize
await waitTransactionProof(client, splitTransactionHash);

// 2. find the token that was split, here as a hack to just take second token from list
const unitIds = await client.getUnitsByOwnerId(signingService.publicKey);
const splitTokenId = unitIds.at(1);
const splitToken = await client.getUnit(splitTokenId);
console.log('Split token ID: ' + Base16Converter.Encode(splitTokenId.getBytes()));
console.log('Split token value: ' + splitToken.data.value);

// 3. check that the original tokens value has been reduced
const originalTokenAfterSplit = await client.getUnit(unitId, false);
console.log("Original token's value after split: " + originalTokenAfterSplit.data.value);

// 4. burn the split token using original fungible token as target
const burnTransactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new BurnFungibleTokenPayload(
      new BurnFungibleTokenAttributes(
        fungibleTokenType,
        splitToken.data.value,
        originalTokenAfterSplit.unitId,
        originalTokenAfterSplit.data.backlink,
        splitToken.data.backlink,
        [null],
      ),
      splitToken.unitId,
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: feeCreditUnitId,
      },
    ),
  ),
);
const transactionRecordWithProof = await waitTransactionProof(client, burnTransactionHash);

// 5. join the split token back into the original fungible token
const joinTransactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new JoinFungibleTokenPayload(
      new JoinFungibleTokenAttributes([transactionRecordWithProof], originalTokenAfterSplit.data.backlink, [null]),
      originalTokenAfterSplit.unitId,
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: feeCreditUnitId,
      },
    ),
  ),
);

// 5b. wait for transaction to finalize
await waitTransactionProof(client, joinTransactionHash);

// 6. check that the original tokens value has been increased
const originalTokenAfterJoin = await client.getUnit(unitId, false);
console.log("Original token's value after join: " + originalTokenAfterJoin.data.value);
