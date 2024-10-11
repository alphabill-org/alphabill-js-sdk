import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { SplitBillTransactionOrder } from '../order/types/SplitBillTransactionOrder.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class SplitBillTransactionRecordWithProof extends TransactionRecordWithProof<SplitBillTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<SplitBillTransactionRecordWithProof> {
    return new SplitBillTransactionRecordWithProof(
      new TransactionRecord(
        await SplitBillTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
