import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { ReclaimFeeCreditTransactionOrder } from '../ReclaimFeeCreditTransactionOrder.js';

export class ReclaimFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<ReclaimFeeCreditTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): ReclaimFeeCreditTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txRecordData = CborDecoder.readArray(CborDecoder.readTag(data[0]).data);
    return new ReclaimFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        CborDecoder.readUnsignedInteger(txRecordData[0]),
        ReclaimFeeCreditTransactionOrder.fromCbor(txRecordData[1]),
        ServerMetadata.fromCbor(txRecordData[2]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
