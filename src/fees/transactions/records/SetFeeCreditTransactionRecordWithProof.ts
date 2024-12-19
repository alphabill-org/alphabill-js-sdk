import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { SetFeeCreditTransactionOrder } from '../SetFeeCreditTransactionOrder.js';

export class SetFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<SetFeeCreditTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): SetFeeCreditTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new SetFeeCreditTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], SetFeeCreditTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
