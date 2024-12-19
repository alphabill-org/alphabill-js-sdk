import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { UnlockBillTransactionOrder } from '../UnlockBillTransactionOrder.js';

export class UnlockBillTransactionRecordWithProof extends TransactionRecordWithProof<UnlockBillTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): UnlockBillTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new UnlockBillTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], UnlockBillTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
