import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { TransferBillToDustCollectorTransactionOrder } from '../TransferBillToDustCollectorTransactionOrder.js';

export class TransferBillToDustCollectorTransactionRecordWithProof extends TransactionRecordWithProof<TransferBillToDustCollectorTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): TransferBillToDustCollectorTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new TransferBillToDustCollectorTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], TransferBillToDustCollectorTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
