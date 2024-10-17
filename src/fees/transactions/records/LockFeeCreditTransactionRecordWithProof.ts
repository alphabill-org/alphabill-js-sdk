import { ServerMetadata } from '../../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../../transaction/record/TransactionRecordWithProof.js';
import { LockFeeCreditTransactionOrder } from '../LockFeeCreditTransactionOrder.js';

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
