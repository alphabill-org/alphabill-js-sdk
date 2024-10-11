import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { TransferFeeCreditTransactionOrder } from '../order/types/TransferFeeCreditTransactionOrder.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class TransferFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<TransferFeeCreditTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<TransferFeeCreditTransactionRecordWithProof> {
    return new TransferFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await TransferFeeCreditTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
