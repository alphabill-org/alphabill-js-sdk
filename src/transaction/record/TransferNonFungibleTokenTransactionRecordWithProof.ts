import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { TransferNonFungibleTokenTransactionOrder } from '../order/types/TransferNonFungibleTokenTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class TransferNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<TransferNonFungibleTokenTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<TransferNonFungibleTokenTransactionRecordWithProof> {
    return new TransferNonFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await TransferNonFungibleTokenTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
