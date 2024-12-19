import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { ReclaimFeeCreditTransactionOrder } from '../ReclaimFeeCreditTransactionOrder.js';

export class ReclaimFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<ReclaimFeeCreditTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): ReclaimFeeCreditTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new ReclaimFeeCreditTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], ReclaimFeeCreditTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
