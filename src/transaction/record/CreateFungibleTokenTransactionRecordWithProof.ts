import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { TransactionProof } from '../../TransactionProof.js';
import { TransactionRecord } from '../../TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { CreateFungibleTokenTransactionOrder } from '../order/types/CreateFungibleTokenTransactionOrder.js';

export class CreateFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<CreateFungibleTokenTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<CreateFungibleTokenTransactionRecordWithProof> {
    return new CreateFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await CreateFungibleTokenTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
