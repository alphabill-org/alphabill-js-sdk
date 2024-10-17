import { ServerMetadata } from '../../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../../transaction/record/TransactionRecordWithProof.js';
import { ReclaimFeeCreditTransactionOrder } from '../ReclaimFeeCreditTransactionOrder.js';

export class ReclaimFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<ReclaimFeeCreditTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<ReclaimFeeCreditTransactionRecordWithProof> {
    return new ReclaimFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await ReclaimFeeCreditTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
