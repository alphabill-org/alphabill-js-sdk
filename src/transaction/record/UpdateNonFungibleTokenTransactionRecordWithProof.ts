import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { TransactionProof } from '../../TransactionProof.js';
import { TransactionRecord } from '../../TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { UpdateNonFungibleTokenTransactionOrder } from '../order/UpdateNonFungibleTokenTransactionOrder.js';

export class UpdateNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<UpdateNonFungibleTokenTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<UpdateNonFungibleTokenTransactionRecordWithProof> {
    return new UpdateNonFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await UpdateNonFungibleTokenTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}