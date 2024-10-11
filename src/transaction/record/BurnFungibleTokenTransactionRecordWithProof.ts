import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { BurnFungibleTokenTransactionOrder } from '../order/types/BurnFungibleTokenTransactionOrder.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class BurnFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<BurnFungibleTokenTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<BurnFungibleTokenTransactionRecordWithProof> {
    return new BurnFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await BurnFungibleTokenTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
