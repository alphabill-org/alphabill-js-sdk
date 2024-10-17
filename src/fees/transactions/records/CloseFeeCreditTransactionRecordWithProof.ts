import { ServerMetadata } from '../../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../../transaction/record/TransactionRecordWithProof.js';
import { CloseFeeCreditTransactionOrder } from '../CloseFeeCreditTransactionOrder.js';

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
