import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../transaction/record/TransactionRecordWithProof.js';
import { TransferBillToDustCollectorTransactionOrder } from './TransferBillToDustCollectorTransactionOrder.js';

export class TransferBillToDustCollectorTransactionRecordWithProof extends TransactionRecordWithProof<TransferBillToDustCollectorTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<TransferBillToDustCollectorTransactionRecordWithProof> {
    return new TransferBillToDustCollectorTransactionRecordWithProof(
      new TransactionRecord(
        await TransferBillToDustCollectorTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
