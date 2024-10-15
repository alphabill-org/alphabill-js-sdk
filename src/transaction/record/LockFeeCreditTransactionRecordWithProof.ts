import { LockFeeCreditTransactionOrder } from '../order/types/LockFeeCreditTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class LockFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<LockFeeCreditTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<LockFeeCreditTransactionRecordWithProof> {
    return new LockFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await LockFeeCreditTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
