import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { SplitFungibleTokenTransactionOrder } from '../order/types/SplitFungibleTokenTransactionOrder.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class SplitFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<SplitFungibleTokenTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<SplitFungibleTokenTransactionRecordWithProof> {
    return new SplitFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await SplitFungibleTokenTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
