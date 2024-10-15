import { SplitFungibleTokenTransactionOrder } from '../order/types/SplitFungibleTokenTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class SplitFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<SplitFungibleTokenTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<SplitFungibleTokenTransactionRecordWithProof> {
    return new SplitFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await SplitFungibleTokenTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
