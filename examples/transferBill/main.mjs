import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient, http } from '@alphabill/alphabill-js-sdk/lib/StateApiClientFactory.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { TransactionPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionPayload.js';
import { TransferBillAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/TransferBillAttributes.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';

import config from '../config.js';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
});
const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const unitIds = await client.getUnitsByOwnerId(signingService.publicKey);
const moneyUnitId = unitIds
  .filter(
    (id) =>
      id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA &&
      Base16Converter.encode(id.bytes) !== '0x000000000000000000000000000000000000000000000000000000000000000100',
  )
  .at(0);

if (!moneyUnitId) {
  throw new Error('No bills available');
}

/**
 * @type {IUnit<Bill>|null}
 */
const bill = await client.getUnit(moneyUnitId, false);
const feeCreditRecordId = new UnitIdWithType(
  sha256(signingService.publicKey),
  UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD,
);
const round = await client.getRoundNumber();

const transactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.MONEY_PARTITION,
      bill?.unitId,
      new TransferBillAttributes(
        await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
        bill?.data.value,
        bill?.data.backlink,
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: feeCreditRecordId,
      },
    ),
  ),
);

console.log(transactionHash);
