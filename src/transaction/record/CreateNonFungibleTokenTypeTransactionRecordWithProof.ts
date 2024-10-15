import { CreateNonFungibleTokenTypeTransactionOrder } from '../order/types/CreateNonFungibleTokenTypeTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class CreateNonFungibleTokenTypeTransactionRecordWithProof extends TransactionRecordWithProof<CreateNonFungibleTokenTypeTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<CreateNonFungibleTokenTypeTransactionRecordWithProof> {
    return new CreateNonFungibleTokenTypeTransactionRecordWithProof(
      new TransactionRecord(
        await CreateNonFungibleTokenTypeTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
