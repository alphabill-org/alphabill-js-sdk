import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { UnitId } from '@alphabill/alphabill-js-sdk/lib/UnitId.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';
import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const client = createTokenClient({
  transport: http(config.tokenPartitionUrl, cborCodec),
  transactionOrderFactory,
});

const feeCreditRecordId = new UnitIdWithType(
  sha256(signingService.publicKey),
  UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD,
);
const round = await client.getRoundNumber();

// expects that the fungible token has already been created
const unitId = new UnitIdWithType(new Uint8Array([1, 2, 3, 4, 5]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN);
const fungibleTokenType = new UnitIdWithType(new Uint8Array([1, 2, 3]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE);
/**
 * @type {FungibleToken|null}
 */
const token = await client.getUnit(unitId, false);

// 1. split the fungible token
console.log("Original token's value before split: " + token.value);
const splitTransactionHash = await client.splitFungibleToken(
  {
    token,
    ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
    amount: 1n,
    nonce: null,
    type: { unitId: fungibleTokenType },
    invariantPredicateSignatures: [null],
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId,
  },
);

// 1b. wait for transaction to finalize
const splitBillProof = await waitTransactionProof(client, splitTransactionHash);

// 2. find the token that was split
const splitTokenId = splitBillProof.transactionRecord.serverMetadata.targetUnits
  .map((bytes) => UnitId.fromBytes(bytes))
  .find(
    (id) =>
      id.type.toBase16() === UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN &&
      Base16Converter.encode(id.bytes) !== Base16Converter.encode(token.unitId.bytes),
  );

/**
 * @type {FungibleToken|null}
 */
const splitToken = await client.getUnit(splitTokenId, false);
console.log('Split token ID: ' + Base16Converter.encode(splitTokenId.bytes));
console.log('Split token value: ' + splitToken?.value);

// 3. check that the original tokens value has been reduced
/**
 * @type {FungibleToken|null}
 */
const originalTokenAfterSplit = await client.getUnit(unitId, false);
console.log("Original token's value after split: " + originalTokenAfterSplit.value);

// 4. burn the split token using original fungible token as target
const burnTransactionHash = await client.burnFungibleToken(
  {
    token: splitToken,
    targetToken: originalTokenAfterSplit,
    type: { unitId: fungibleTokenType },
    invariantPredicateSignatures: [null],
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId,
  },
);
const transactionRecordWithProof = await waitTransactionProof(client, burnTransactionHash);

// 5. join the split token back into the original fungible token
const joinTransactionHash = await client.joinFungibleTokens(
  {
    proofs: [transactionRecordWithProof],
    token: originalTokenAfterSplit,
    invariantPredicateSignatures: [null],
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId,
  },
);

// 5b. wait for transaction to finalize
await waitTransactionProof(client, joinTransactionHash);

// 6. check that the original tokens value has been increased
/**
 * @type {FungibleToken|null}
 */
const originalTokenAfterJoin = await client.getUnit(unitId, false);
console.log("Original token's value after join: " + originalTokenAfterJoin?.value);
