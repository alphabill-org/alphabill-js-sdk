import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { SwapBillsWithDustCollectorTransactionOrder } from '../SwapBillsWithDustCollectorTransactionOrder.js';

export class SwapBillsWithDustCollectorTransactionRecordWithProof extends TransactionRecordWithProof<SwapBillsWithDustCollectorTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): SwapBillsWithDustCollectorTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new SwapBillsWithDustCollectorTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], SwapBillsWithDustCollectorTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
