import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { UnlockFeeCreditTransactionOrder } from '../order/types/UnlockFeeCreditTransactionOrder.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class UnlockFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<UnlockFeeCreditTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<UnlockFeeCreditTransactionRecordWithProof> {
    return new UnlockFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        await UnlockFeeCreditTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
