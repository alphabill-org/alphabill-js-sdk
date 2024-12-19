import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { LockTokenTransactionOrder } from '../LockTokenTransactionOrder.js';

export class LockTokenTransactionRecordWithProof extends TransactionRecordWithProof<LockTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): LockTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new LockTokenTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], LockTokenTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
