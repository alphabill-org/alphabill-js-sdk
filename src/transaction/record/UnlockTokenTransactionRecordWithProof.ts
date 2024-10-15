import { UnlockTokenTransactionOrder } from '../order/types/UnlockTokenTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class UnlockTokenTransactionRecordWithProof extends TransactionRecordWithProof<UnlockTokenTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<UnlockTokenTransactionRecordWithProof> {
    return new UnlockTokenTransactionRecordWithProof(
      new TransactionRecord(
        await UnlockTokenTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
