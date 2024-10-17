import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../transaction/record/TransactionRecordWithProof.js';
import { UnlockBillTransactionOrder } from './UnlockBillTransactionOrder.js';

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
