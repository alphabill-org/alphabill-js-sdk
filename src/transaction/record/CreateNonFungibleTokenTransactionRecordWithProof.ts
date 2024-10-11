import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { CreateNonFungibleTokenTransactionOrder } from '../order/types/CreateNonFungibleTokenTransactionOrder.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class CreateNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<CreateNonFungibleTokenTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<CreateNonFungibleTokenTransactionRecordWithProof> {
    return new CreateNonFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        await CreateNonFungibleTokenTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
