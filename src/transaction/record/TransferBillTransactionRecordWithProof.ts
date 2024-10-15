import { TransferBillTransactionOrder } from '../order/types/TransferBillTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class TransferBillTransactionRecordWithProof extends TransactionRecordWithProof<TransferBillTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<TransferBillTransactionRecordWithProof> {
    return new TransferBillTransactionRecordWithProof(
      new TransactionRecord(
        await TransferBillTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
