import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { SwapBillsWithDustCollectorAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/SwapBillsWithDustCollectorAttributes.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { TransactionPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionPayload.js';
import { TransferBillToDustCollectorAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/TransferBillToDustCollectorAttributes.js';
import { UnitIdWithType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitIdWithType.js';
import { UnitType } from '@alphabill/alphabill-js-sdk/lib/transaction/UnitType.js';
import { Base16Converter } from '@alphabill/alphabill-js-sdk/lib/util/Base16Converter.js';
import { sha256 } from '@noble/hashes/sha256';

import config from '../config.js';
import { waitTransactionProof } from '../waitTransactionProof.mjs';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
});
const signingService = new DefaultSigningService(Base16Converter.decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const unitIds = await client.getUnitsByOwnerId(signingService.publicKey);
const targetUnitIdHex = '0x000000000000000000000000000000000000000000000000000000000000000100';
const targetUnitId = new UnitIdWithType(
  new Uint8Array(Base16Converter.decode(targetUnitIdHex)),
  UnitType.MONEY_PARTITION_BILL_DATA,
);
const moneyUnitId = unitIds
  .filter(
    (id) =>
      id.type.toBase16() === UnitType.MONEY_PARTITION_BILL_DATA && Base16Converter.encode(id.bytes) !== targetUnitIdHex,
  )
  .at(0);

if (!moneyUnitId) {
  throw new Error('No bills available');
}

/**
 * @type {IUnit<Bill>|null}
 */
const targetBill = await client.getUnit(targetUnitId, false);
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
      new TransferBillToDustCollectorAttributes(
        bill?.data.value,
        targetBill?.unitId,
        targetBill?.data.backlink,
        bill?.data.backlink,
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId,
      },
    ),
  ),
);

const transactionProof = await waitTransactionProof(client, transactionHash);

await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    TransactionPayload.create(
      SystemIdentifier.MONEY_PARTITION,
      targetBill?.unitId,
      new SwapBillsWithDustCollectorAttributes(
        await PayToPublicKeyHashPredicate.create(cborCodec, signingService.publicKey),
        [transactionProof],
        bill?.data.value,
      ),
      {
        maxTransactionFee: 5n,
        timeout: round + 100n,
        feeCreditRecordId,
      },
    ),
  ),
);
