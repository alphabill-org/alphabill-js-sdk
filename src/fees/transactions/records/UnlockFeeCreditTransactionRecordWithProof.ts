import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { UnlockFeeCreditTransactionOrder } from '../UnlockFeeCreditTransactionOrder.js';

export class UnlockFeeCreditTransactionRecordWithProof extends TransactionRecordWithProof<UnlockFeeCreditTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): UnlockFeeCreditTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txOrderData = CborDecoder.readArray(data[0]);
    return new UnlockFeeCreditTransactionRecordWithProof(
      new TransactionRecord(
        UnlockFeeCreditTransactionOrder.fromCbor(txOrderData[0]),
        ServerMetadata.fromCbor(txOrderData[1]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
