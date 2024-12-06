import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { CloseFeeCreditTransactionOrder } from '../CloseFeeCreditTransactionOrder.js';

export class CloseFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<CloseFeeCreditTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CloseFeeCreditTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txRecordData = CborDecoder.readArray(CborDecoder.readTag(data[0]).data);
    return new CloseFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        CborDecoder.readUnsignedInteger(txRecordData[0]),
        CloseFeeCreditTransactionOrder.fromCbor(txRecordData[1]),
        ServerMetadata.fromCbor(txRecordData[2]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
