import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../transaction/record/TransactionRecordWithProof.js';
import { UpdateNonFungibleTokenTransactionOrder } from './UpdateNonFungibleTokenTransactionOrder.js';

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
