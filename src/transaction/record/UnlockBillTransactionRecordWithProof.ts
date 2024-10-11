import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { UnlockBillTransactionOrder } from '../order/types/UnlockBillTransactionOrder.js';
import { ServerMetadata } from './ServerMetadata.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class UnlockBillTransactionRecordWithProof extends TransactionRecordWithProof<UnlockBillTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<UnlockBillTransactionRecordWithProof> {
    return new UnlockBillTransactionRecordWithProof(
      new TransactionRecord(
        await UnlockBillTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
