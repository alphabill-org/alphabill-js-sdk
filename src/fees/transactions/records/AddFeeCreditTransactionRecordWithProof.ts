import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { AddFeeCreditTransactionOrder } from '../AddFeeCreditTransactionOrder.js';

export class AddFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<AddFeeCreditTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): AddFeeCreditTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new AddFeeCreditTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], AddFeeCreditTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
