import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { TransactionProof } from '../../TransactionProof.js';
import { TransactionRecord } from '../../TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { ReclaimFeeCreditTransactionOrder } from '../order/types/ReclaimFeeCreditTransactionOrder.js';

export class ReclaimFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<ReclaimFeeCreditTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<ReclaimFeeCreditTransactionRecordWithProof> {
    return new ReclaimFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await ReclaimFeeCreditTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
