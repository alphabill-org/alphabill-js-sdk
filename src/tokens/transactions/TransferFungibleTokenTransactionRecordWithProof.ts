import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransferFungibleTokenTransactionOrder } from './TransferFungibleTokenTransactionOrder.js';

export class TransferFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<TransferFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): TransferFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txOrderData = CborDecoder.readArray(data[0]);
    return new TransferFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        TransferFungibleTokenTransactionOrder.fromCbor(txOrderData[0]),
        ServerMetadata.fromCbor(txOrderData[1]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
