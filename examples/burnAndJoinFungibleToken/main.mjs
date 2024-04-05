import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { BurnFungibleTokenAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/BurnFungibleTokenAttributes.js';
import { BurnFungibleTokenPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/BurnFungibleTokenPayload.js';
import { FeeCreditUnitId } from '@alphabill/alphabill-js-sdk/lib/transaction/FeeCreditUnitId.js';
import { JoinFungibleTokenAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/JoinFungibleTokenAttributes.js';
import { JoinFungibleTokenPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/JoinFungibleTokenPayload.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { SplitFungibleTokenAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/SplitFungibleTokenAttributes.js';
import { SplitFungibleTokenPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/SplitFungibleTokenPayload.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
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

const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.getPublicKey()), SystemIdentifier.TOKEN_PARTITION);
const round = await client.getRoundNumber();

// expects that the fungible token has already been created
const unitId = new UnitIdWithType(new Uint8Array([1, 2, 3, 4, 5]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN);
const fungibleTokenType = new UnitIdWithType(new Uint8Array([1, 2, 3]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE);
const token = await client.getUnit(unitId, false);

// 1. split the fungible token
const targetValue = 1n;
console.log("Original token's value before split: " + token.getData().getValue());
const remainingValue = token.getData().getValue() - targetValue;
const splitTransactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new SplitFungibleTokenPayload(
      new SplitFungibleTokenAttributes(
        await PayToPublicKeyHashPredicate.create(cborCodec, signingService.getPublicKey()),
        targetValue,
        null,
        token.getData().getBacklink(),
        fungibleTokenType,
        remainingValue,
        [null],
      ),
      token.getUnitId(),
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
const unitIds = await client.getUnitsByOwnerId(signingService.getPublicKey());
const splitTokenId = unitIds.at(1);
const splitToken = await client.getUnit(splitTokenId, false);
console.log('Split token ID: ' + Base16Converter.encode(splitTokenId.getBytes()));
console.log('Split token value: ' + splitToken.getData().getValue());

// 3. check that the original tokens value has been reduced
const originalTokenAfterSplit = await client.getUnit(unitId, false);
console.log("Original token's value after split: " + originalTokenAfterSplit.getData().getValue());

// 4. burn the split token using original fungible token as target
const burnTransactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new BurnFungibleTokenPayload(
      new BurnFungibleTokenAttributes(
        fungibleTokenType,
        splitToken.getData().getValue(),
        originalTokenAfterSplit.getUnitId(),
        originalTokenAfterSplit.getData().getBacklink(),
        splitToken.getData().getBacklink(),
        [null],
      ),
      splitToken.getUnitId(),
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
      new JoinFungibleTokenAttributes([transactionRecordWithProof], originalTokenAfterSplit.getData().getBacklink(), [
        null,
      ]),
      originalTokenAfterSplit.getUnitId(),
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
console.log("Original token's value after join: " + originalTokenAfterJoin.getData().getValue());