import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createTokenClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';

import config from '../config.js';

const cborCodec = new CborCodecNode();
const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const client = createTokenClient({
  transport: http(config.tokenPartitionUrl, new CborCodecNode()),
  transactionOrderFactory,
});

const feeCreditRecordId = new UnitIdWithType(
  sha256(signingService.publicKey),
  UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD,
);
const round = await client.getRoundNumber();

// expects that the fungible token has already been created
const unitId = new UnitIdWithType(new Uint8Array([1, 2, 3, 4, 5]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN);
/**
 * @type {FungibleToken|null}
 */
const token = await client.getUnit(unitId, false);

const transactionHash = await client.splitFungibleToken(
  {
    token,
    ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
    amount: 3n,
    nonce: null,
    type: { unitId: new UnitIdWithType(new Uint8Array([1, 2, 3]), UnitType.TOKEN_PARTITION_FUNGIBLE_TOKEN_TYPE) },
    invariantPredicateSignatures: [null],
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId,
  },
);

console.log(transactionHash);
