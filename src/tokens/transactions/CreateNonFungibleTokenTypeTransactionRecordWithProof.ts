import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../transaction/record/TransactionRecordWithProof.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from './CreateNonFungibleTokenTypeTransactionOrder.js';

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