import { CreateFungibleTokenTransactionOrder } from '../order/types/CreateFungibleTokenTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class CreateFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<CreateFungibleTokenTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<CreateFungibleTokenTransactionRecordWithProof> {
    return new CreateFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await CreateFungibleTokenTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
