import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { DeleteFeeCreditTransactionOrder } from '../DeleteFeeCreditTransactionOrder.js';

export class DeleteFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<DeleteFeeCreditTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): DeleteFeeCreditTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new DeleteFeeCreditTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], DeleteFeeCreditTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
