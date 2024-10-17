import { ServerMetadata } from '../../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../../transaction/record/TransactionRecordWithProof.js';
import { UnlockFeeCreditTransactionOrder } from '../UnlockFeeCreditTransactionOrder.js';

export class UnlockFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<UnlockFeeCreditTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<UnlockFeeCreditTransactionRecordWithProof> {
    return new UnlockFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await UnlockFeeCreditTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
