import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { SplitBillTransactionOrder } from '../SplitBillTransactionOrder.js';

export class SplitBillTransactionRecordWithProof extends TransactionRecordWithProof<SplitBillTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): SplitBillTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new SplitBillTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], SplitBillTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
