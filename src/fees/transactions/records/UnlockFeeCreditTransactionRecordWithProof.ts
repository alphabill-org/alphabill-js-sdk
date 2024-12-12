import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { UnlockFeeCreditTransactionOrder } from '../UnlockFeeCreditTransactionOrder.js';

export class UnlockFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<UnlockFeeCreditTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): UnlockFeeCreditTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new UnlockFeeCreditTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], UnlockFeeCreditTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
