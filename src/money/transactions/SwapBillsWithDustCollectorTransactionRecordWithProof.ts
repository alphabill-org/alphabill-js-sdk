import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../transaction/record/TransactionRecordWithProof.js';
import { SwapBillsWithDustCollectorTransactionOrder } from './SwapBillsWithDustCollectorTransactionOrder.js';

export class SwapBillsWithDustCollectorTransactionRecordWithProof extends TransactionRecordWithProof<SwapBillsWithDustCollectorTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<SwapBillsWithDustCollectorTransactionRecordWithProof> {
    return new SwapBillsWithDustCollectorTransactionRecordWithProof(
      new TransactionRecord(
        await SwapBillsWithDustCollectorTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
