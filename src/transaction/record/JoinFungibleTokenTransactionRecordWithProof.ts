import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { TransactionProof } from '../../TransactionProof.js';
import { TransactionRecord } from '../../TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { JoinFungibleTokenTransactionOrder } from '../order/types/JoinFungibleTokenTransactionOrder.js';

export class JoinFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<JoinFungibleTokenTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<JoinFungibleTokenTransactionRecordWithProof> {
    return new JoinFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await JoinFungibleTokenTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
