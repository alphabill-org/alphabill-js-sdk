import { BurnFungibleTokenTransactionOrder } from '../order/types/BurnFungibleTokenTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class BurnFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<BurnFungibleTokenTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<BurnFungibleTokenTransactionRecordWithProof> {
    return new BurnFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await BurnFungibleTokenTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
