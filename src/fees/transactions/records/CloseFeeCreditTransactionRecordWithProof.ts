import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { CloseFeeCreditTransactionOrder } from '../CloseFeeCreditTransactionOrder.js';

export class CloseFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<CloseFeeCreditTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CloseFeeCreditTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new CloseFeeCreditTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], CloseFeeCreditTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
