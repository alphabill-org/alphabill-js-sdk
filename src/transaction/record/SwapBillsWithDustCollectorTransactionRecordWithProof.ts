import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { TransactionProof } from '../../TransactionProof.js';
import { TransactionRecord } from '../../TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { SwapBillsWithDustCollectorTransactionOrder } from '../order/SwapBillsWithDustCollectorTransactionOrder.js';

export class SwapBillsWithDustCollectorTransactionRecordWithProof extends TransactionRecordWithProof<SwapBillsWithDustCollectorTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<SwapBillsWithDustCollectorTransactionRecordWithProof> {
    return new SwapBillsWithDustCollectorTransactionRecordWithProof(
      new TransactionRecord(
        await SwapBillsWithDustCollectorTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
