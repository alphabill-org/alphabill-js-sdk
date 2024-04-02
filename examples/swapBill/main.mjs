import { sha256 } from '@noble/hashes/sha256';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/PayToPublicKeyHashPredicate.js';
import { SwapBillsWithDustCollectorAttributes } from '../../lib/transaction/SwapBillsWithDustCollectorAttributes.js';
import { SwapBillsWithDustCollectorPayload } from '../../lib/transaction/SwapBillsWithDustCollectorPayload.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { TransferBillToDustCollectorPayload } from '../../lib/transaction/TransferBillDustCollectorPayload.js';
import { TransferBillToDustCollectorAttributes } from '../../lib/transaction/TransferBillToDustCollectorAttributes.js';
import { UnitIdWithType } from '../../lib/transaction/UnitIdWithType.js';
import { UnitType } from '../../lib/transaction/UnitType.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';

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
  .filter((id) => {
    return (
      Base16Converter.encode(id.getType()) ===
        Base16Converter.encode(new Uint8Array([UnitType.MONEY_PARTITION_BILL_DATA])) &&
      Base16Converter.encode(id.getBytes()) !== targetUnitIdHex
    );
  })
  .at(0);

if (!moneyUnitId) {
  throw new Error('No bills available');
}

const targetBill = await client.getUnit(targetUnitId, false);
const bill = await client.getUnit(moneyUnitId, false);
const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.publicKey), SystemIdentifier.MONEY_PARTITION);
const round = await client.getRoundNumber();

const transactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new TransferBillToDustCollectorPayload(
      new TransferBillToDustCollectorAttributes(
        bill.data.value,
        targetBill.unitId,
        targetBill.data.backlink,
        bill.data.backlink,
      ),
      bill.unitId,
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
        await PayToPublicKeyHashPredicate.Create(cborCodec, signingService.publicKey),
        [transactionProof],
        bill.data.value,
      ),
      targetBill.unitId,
      {
        maxTransactionFee: 5n,
        timeout: round + 100n,
        feeCreditRecordId: feeCreditUnitId,
      },
    ),
  ),
);
