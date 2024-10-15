import { TransferFungibleTokenTransactionOrder } from '../order/types/TransferFungibleTokenTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class TransferFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<TransferFungibleTokenTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<TransferFungibleTokenTransactionRecordWithProof> {
    return new TransferFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await TransferFungibleTokenTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
