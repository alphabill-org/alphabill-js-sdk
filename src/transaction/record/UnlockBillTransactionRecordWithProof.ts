import { UnlockBillTransactionOrder } from '../order/types/UnlockBillTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class UnlockBillTransactionRecordWithProof extends TransactionRecordWithProof<UnlockBillTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<UnlockBillTransactionRecordWithProof> {
    return new UnlockBillTransactionRecordWithProof(
      new TransactionRecord(
        await UnlockBillTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
