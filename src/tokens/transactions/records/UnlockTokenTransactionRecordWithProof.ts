import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { UnlockTokenTransactionOrder } from '../UnlockTokenTransactionOrder.js';

export class UnlockTokenTransactionRecordWithProof extends TransactionRecordWithProof<UnlockTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): UnlockTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new UnlockTokenTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], UnlockTokenTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
