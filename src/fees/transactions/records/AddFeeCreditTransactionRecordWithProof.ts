import { ServerMetadata } from '../../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../../transaction/record/TransactionRecordWithProof.js';
import { AddFeeCreditTransactionOrder } from '../AddFeeCreditTransactionOrder.js';

export class AddFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<AddFeeCreditTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<AddFeeCreditTransactionRecordWithProof> {
    return new AddFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await AddFeeCreditTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
