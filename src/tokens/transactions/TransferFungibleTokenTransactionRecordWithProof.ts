import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../transaction/record/TransactionRecordWithProof.js';
import { TransferFungibleTokenTransactionOrder } from './TransferFungibleTokenTransactionOrder.js';

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
