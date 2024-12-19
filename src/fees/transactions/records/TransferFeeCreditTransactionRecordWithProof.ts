import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { TransferFeeCreditTransactionOrder } from '../TransferFeeCreditTransactionOrder.js';

export class TransferFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<TransferFeeCreditTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): TransferFeeCreditTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new TransferFeeCreditTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], TransferFeeCreditTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
