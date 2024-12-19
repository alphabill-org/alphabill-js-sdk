import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { LockBillTransactionOrder } from '../LockBillTransactionOrder.js';

export class LockBillTransactionRecordWithProof extends TransactionRecordWithProof<LockBillTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): LockBillTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new LockBillTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], LockBillTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
