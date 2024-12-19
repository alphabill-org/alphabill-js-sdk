import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { TransferBillTransactionOrder } from '../TransferBillTransactionOrder.js';

export class TransferBillTransactionRecordWithProof extends TransactionRecordWithProof<TransferBillTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): TransferBillTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new TransferBillTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], TransferBillTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
