import { CreateFungibleTokenTypeTransactionOrder } from '../order/types/CreateFungibleTokenTypeTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class CreateFungibleTokenTypeTransactionRecordWithProof extends TransactionRecordWithProof<CreateFungibleTokenTypeTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<CreateFungibleTokenTypeTransactionRecordWithProof> {
    return new CreateFungibleTokenTypeTransactionRecordWithProof(
      new TransactionRecord(
        await CreateFungibleTokenTypeTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
