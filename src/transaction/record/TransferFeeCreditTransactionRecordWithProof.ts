import { TransferFeeCreditTransactionOrder } from '../order/types/TransferFeeCreditTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class TransferFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<TransferFeeCreditTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<TransferFeeCreditTransactionRecordWithProof> {
    return new TransferFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await TransferFeeCreditTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
