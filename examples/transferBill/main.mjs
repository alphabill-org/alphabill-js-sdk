import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createMoneyClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
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

const client = createMoneyClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
  transactionOrderFactory,
});

const moneyUnitId = UnitIdWithType.fromBytes(
  Base16Converter.decode('0x000000000000000000000000000000000000000000000000000000000000000100'),
);

if (!moneyUnitId) {
  throw new Error('No bills available');
}

/**
 * @type {Bill|null}
 */
const bill = await client.getUnit(moneyUnitId, false);
const feeCreditRecordId = new UnitIdWithType(
  sha256(signingService.publicKey),
  UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD,
);
const round = await client.getRoundNumber();

const transactionHash = await client.transferBill(
  {
    ownerPredicate: await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
    bill,
  },
  {
    maxTransactionFee: 5n,
    timeout: round + 60n,
    feeCreditRecordId,
  },
);

console.log(transactionHash);
