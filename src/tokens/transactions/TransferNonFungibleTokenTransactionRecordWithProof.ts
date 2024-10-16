import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../transaction/record/TransactionRecordWithProof.js';
import { TransferNonFungibleTokenTransactionOrder } from './TransferNonFungibleTokenTransactionOrder.js';

export class TransferNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<TransferNonFungibleTokenTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<TransferNonFungibleTokenTransactionRecordWithProof> {
    return new TransferNonFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await TransferNonFungibleTokenTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
