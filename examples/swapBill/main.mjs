import { CborCodecNode } from '@alphabill/alphabill-js-sdk/lib/codec/cbor/CborCodecNode.js';
import { http } from '@alphabill/alphabill-js-sdk/lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '@alphabill/alphabill-js-sdk/lib/signing/DefaultSigningService.js';
import { createPublicClient } from '@alphabill/alphabill-js-sdk/lib/StateApiClient.js';
import { SystemIdentifier } from '@alphabill/alphabill-js-sdk/lib/SystemIdentifier.js';
import { FeeCreditUnitId } from '@alphabill/alphabill-js-sdk/lib/transaction/FeeCreditUnitId.js';
import { PayToPublicKeyHashPredicate } from '@alphabill/alphabill-js-sdk/lib/transaction/PayToPublicKeyHashPredicate.js';
import { SwapBillsWithDustCollectorAttributes } from '@alphabill/alphabill-js-sdk/lib/transaction/SwapBillsWithDustCollectorAttributes.js';
import { SwapBillsWithDustCollectorPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/SwapBillsWithDustCollectorPayload.js';
import { TransactionOrderFactory } from '@alphabill/alphabill-js-sdk/lib/transaction/TransactionOrderFactory.js';
import { TransferBillToDustCollectorPayload } from '@alphabill/alphabill-js-sdk/lib/transaction/TransferBillDustCollectorPayload.js';
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

const unitIds = await client.getUnitsByOwnerId(signingService.getPublicKey());
const targetUnitIdHex = '0x000000000000000000000000000000000000000000000000000000000000000100';
const targetUnitId = new UnitIdWithType(
  new Uint8Array(Base16Converter.decode(targetUnitIdHex)),
  UnitType.MONEY_PARTITION_BILL_DATA,
);
const moneyUnitId = unitIds
  .filter(
    (id) =>
      id.getType().toBase16() === UnitType.MONEY_PARTITION_BILL_DATA &&
      Base16Converter.encode(id.getBytes()) !== targetUnitIdHex,
  )
  .at(0);

if (!moneyUnitId) {
  throw new Error('No bills available');
}

const targetBill = await client.getUnit(targetUnitId, false);
const bill = await client.getUnit(moneyUnitId, false);
const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.getPublicKey()), SystemIdentifier.MONEY_PARTITION);
const round = await client.getRoundNumber();

const transactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new TransferBillToDustCollectorPayload(
      new TransferBillToDustCollectorAttributes(
        bill.getData().getValue(),
        targetBill.getUnitId(),
        targetBill.getData().getBacklink(),
        bill.getData().getBacklink(),
      ),
      bill.getUnitId(),
      {
        maxTransactionFee: 5n,
        timeout: round + 60n,
        feeCreditRecordId: feeCreditUnitId,
      },
    ),
  ),
);

const transactionProof = await waitTransactionProof(client, transactionHash);

await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new SwapBillsWithDustCollectorPayload(
      new SwapBillsWithDustCollectorAttributes(
        await PayToPublicKeyHashPredicate.create(cborCodec, signingService.getPublicKey()),
        [transactionProof],
        bill.getData().getValue(),
      ),
      targetBill.getUnitId(),
      {
        maxTransactionFee: 5n,
        timeout: round + 100n,
        feeCreditRecordId: feeCreditUnitId,
      },
    ),
  ),
);
