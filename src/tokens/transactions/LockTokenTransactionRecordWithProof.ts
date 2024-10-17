import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../transaction/record/TransactionRecordWithProof.js';
import { LockTokenTransactionOrder } from './LockTokenTransactionOrder.js';

export class LockTokenTransactionRecordWithProof extends TransactionRecordWithProof<LockTokenTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<LockTokenTransactionRecordWithProof> {
    return new LockTokenTransactionRecordWithProof(
      new TransactionRecord(
        await LockTokenTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
