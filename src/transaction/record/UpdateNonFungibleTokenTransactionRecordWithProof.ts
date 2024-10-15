import { UpdateNonFungibleTokenTransactionOrder } from '../order/types/UpdateNonFungibleTokenTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class UpdateNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<UpdateNonFungibleTokenTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<UpdateNonFungibleTokenTransactionRecordWithProof> {
    return new UpdateNonFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await UpdateNonFungibleTokenTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
