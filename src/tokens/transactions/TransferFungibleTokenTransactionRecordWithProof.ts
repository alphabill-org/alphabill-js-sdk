import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransferFungibleTokenTransactionOrder } from './TransferFungibleTokenTransactionOrder.js';

export class TransferFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<TransferFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): TransferFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txRecordData = CborDecoder.readArray(CborDecoder.readTag(data[0]).data);
    return new TransferFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        CborDecoder.readUnsignedInteger(txRecordData[0]),
        TransferFungibleTokenTransactionOrder.fromCbor(txRecordData[1]),
        ServerMetadata.fromCbor(txRecordData[2]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
