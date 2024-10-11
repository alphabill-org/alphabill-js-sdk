import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { AddFeeCreditTransactionOrder } from '../order/types/AddFeeCreditTransactionOrder.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class AddFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<AddFeeCreditTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<AddFeeCreditTransactionRecordWithProof> {
    return new AddFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await AddFeeCreditTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
