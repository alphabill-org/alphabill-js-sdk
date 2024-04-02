import { sha256 } from '@noble/hashes/sha256';
import { CborCodecNode } from '../../lib/codec/cbor/CborCodecNode.js';
import { http } from '../../lib/json-rpc/StateApiJsonRpcService.js';
import { DefaultSigningService } from '../../lib/signing/DefaultSigningService.js';
import { createPublicClient } from '../../lib/StateApiClient.js';
import { SystemIdentifier } from '../../lib/SystemIdentifier.js';
import { FeeCreditUnitId } from '../../lib/transaction/FeeCreditUnitId.js';
import { PayToPublicKeyHashPredicate } from '../../lib/transaction/PayToPublicKeyHashPredicate.js';
import { TransactionOrderFactory } from '../../lib/transaction/TransactionOrderFactory.js';
import { TransferBillAttributes } from '../../lib/transaction/TransferBillAttributes.js';
import { TransferBillPayload } from '../../lib/transaction/TransferBillPayload.js';
import { UnitType } from '../../lib/transaction/UnitType.js';
import { Base16Converter } from '../../lib/util/Base16Converter.js';

import config from '../config.js';

const cborCodec = new CborCodecNode();
const client = createPublicClient({
  transport: http(config.moneyPartitionUrl, cborCodec),
});
const signingService = new DefaultSigningService(Base16Converter.Decode(config.privateKey));
const transactionOrderFactory = new TransactionOrderFactory(cborCodec, signingService);

const unitIds = await client.getUnitsByOwnerId(signingService.publicKey);
const moneyUnitId = unitIds
  .filter((id) => {
    return (
      Base16Converter.Encode(id.getType()) ===
        Base16Converter.Encode(new Uint8Array([UnitType.MONEY_PARTITION_BILL_DATA])) &&
      Base16Converter.Encode(id.getBytes()) !== '0x000000000000000000000000000000000000000000000000000000000000000100'
    );
  })
  .at(0);

if (!moneyUnitId) {
  throw new Error('No bills available');
}

const bill = await client.getUnit(moneyUnitId, false);
const feeCreditUnitId = new FeeCreditUnitId(sha256(signingService.publicKey), SystemIdentifier.MONEY_PARTITION);
const round = await client.getRoundNumber();

const transactionHash = await client.sendTransaction(
  await transactionOrderFactory.createTransaction(
    new TransferBillPayload(
      new TransferBillAttributes(
        await PayToPublicKeyHashPredicate.Create(cborCodec, signingService.publicKey),
        bill.data.value,
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

console.log(transactionHash);
