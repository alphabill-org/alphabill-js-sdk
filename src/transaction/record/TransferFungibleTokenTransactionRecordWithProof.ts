import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { TransferFungibleTokenTransactionOrder } from '../order/types/TransferFungibleTokenTransactionOrder.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class TransferFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<TransferFungibleTokenTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<TransferFungibleTokenTransactionRecordWithProof> {
    return new TransferFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await TransferFungibleTokenTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
