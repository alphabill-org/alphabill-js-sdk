import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ServerMetadata } from '../../ServerMetadata.js';
import { TransactionProof } from '../../TransactionProof.js';
import { TransactionRecord } from '../../TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { TransferBillToDustCollectorTransactionOrder } from '../order/TransferBillToDustCollectorTransactionOrder.js';

export class TransferBillToDustCollectorTransactionRecordWithProof extends TransactionRecordWithProof<TransferBillToDustCollectorTransactionOrder> {
  public static async fromArray(
    [[transactionOrder, serverMetadata], transactionProof]: TransactionRecordWithProofArray,
    cborCodec: ICborCodec,
  ): Promise<TransferBillToDustCollectorTransactionRecordWithProof> {
    return new TransferBillToDustCollectorTransactionRecordWithProof(
      new TransactionRecord(
        await TransferBillToDustCollectorTransactionOrder.fromArray(transactionOrder, cborCodec),
        ServerMetadata.fromArray(serverMetadata),
      ),
      TransactionProof.fromArray(transactionProof),
    );
  }
}
