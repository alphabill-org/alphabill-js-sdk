import { ServerMetadata } from '../../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../../transaction/record/TransactionRecordWithProof.js';
import { SetFeeCreditTransactionOrder } from '../SetFeeCreditTransactionOrder.js';

export class SetFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<SetFeeCreditTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<SetFeeCreditTransactionRecordWithProof> {
    return new SetFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await SetFeeCreditTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
