import { CloseFeeCreditTransactionOrder } from '../order/types/CloseFeeCreditTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class CloseFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<CloseFeeCreditTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<CloseFeeCreditTransactionRecordWithProof> {
    return new CloseFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await CloseFeeCreditTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
