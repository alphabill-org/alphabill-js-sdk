import { ReclaimFeeCreditTransactionOrder } from '../order/types/ReclaimFeeCreditTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

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
