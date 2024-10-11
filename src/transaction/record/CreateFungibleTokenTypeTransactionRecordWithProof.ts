import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { CreateFungibleTokenTypeTransactionOrder } from '../order/types/CreateFungibleTokenTypeTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class CreateFungibleTokenTypeTransactionRecordWithProof extends TransactionRecordWithProof<CreateFungibleTokenTypeTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<CreateFungibleTokenTypeTransactionRecordWithProof> {
    return new CreateFungibleTokenTypeTransactionRecordWithProof(
      new TransactionRecord(
        await CreateFungibleTokenTypeTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
