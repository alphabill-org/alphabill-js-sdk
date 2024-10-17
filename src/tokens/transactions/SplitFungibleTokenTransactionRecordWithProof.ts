import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import {
  TransactionRecordWithProof,
  TransactionRecordWithProofArray,
} from '../../transaction/record/TransactionRecordWithProof.js';
import { SplitFungibleTokenTransactionOrder } from './SplitFungibleTokenTransactionOrder.js';

export class SplitFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<SplitFungibleTokenTransactionOrder> {
  public static async fromArray([
    [transactionOrder, serverMetadata],
    transactionProof,
  ]: TransactionRecordWithProofArray): Promise<SplitFungibleTokenTransactionRecordWithProof> {
    return new SplitFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await SplitFungibleTokenTransactionOrder.fromArray(transactionOrder),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
