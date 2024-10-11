import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { UnlockTokenTransactionOrder } from '../order/types/UnlockTokenTransactionOrder.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from './TransactionRecordWithProof.js';

export class UnlockTokenTransactionRecordWithProof extends TransactionRecordWithProof<UnlockTokenTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<UnlockTokenTransactionRecordWithProof> {
    return new UnlockTokenTransactionRecordWithProof(
      new TransactionRecord(
        await UnlockTokenTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
