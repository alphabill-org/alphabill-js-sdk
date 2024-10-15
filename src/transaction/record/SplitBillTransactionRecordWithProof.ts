import { SplitBillTransactionOrder } from '../order/types/SplitBillTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class SplitBillTransactionRecordWithProof extends TransactionRecordWithProof<SplitBillTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<SplitBillTransactionRecordWithProof> {
    return new SplitBillTransactionRecordWithProof(
      new TransactionRecord(
        await SplitBillTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
