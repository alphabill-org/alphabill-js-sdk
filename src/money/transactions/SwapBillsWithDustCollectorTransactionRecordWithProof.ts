import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { SwapBillsWithDustCollectorTransactionOrder } from './SwapBillsWithDustCollectorTransactionOrder.js';

export class SwapBillsWithDustCollectorTransactionRecordWithProof extends TransactionRecordWithProof<SwapBillsWithDustCollectorTransactionOrder> {
  public static async fromCbor(rawData: Uint8Array): Promise<SwapBillsWithDustCollectorTransactionRecordWithProof> {
    const data = CborDecoder.readArray(rawData);
    const txOrderData = CborDecoder.readArray(data[0]);
    return new SwapBillsWithDustCollectorTransactionRecordWithProof(
      new TransactionRecord(
        await SwapBillsWithDustCollectorTransactionOrder.fromCbor(txOrderData[0]),
        ServerMetadata.fromCbor(txOrderData[1]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
