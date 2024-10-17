import { ServerMetadata } from '../../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../../transaction/record/TransactionRecordWithProof.js';
import { DeleteFeeCreditTransactionOrder } from '../DeleteFeeCreditTransactionOrder.js';

export class DeleteFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<DeleteFeeCreditTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<DeleteFeeCreditTransactionRecordWithProof> {
    return new DeleteFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await DeleteFeeCreditTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
