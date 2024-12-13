import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { UpdateNonFungibleTokenTransactionOrder } from './UpdateNonFungibleTokenTransactionOrder.js';

export class UpdateNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<UpdateNonFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): UpdateNonFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txRecordData = CborDecoder.readArray(CborDecoder.readTag(data[0]).data);
    return new UpdateNonFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        CborDecoder.readUnsignedInteger(txRecordData[0]),
        UpdateNonFungibleTokenTransactionOrder.fromCbor(txRecordData[1]),
        ServerMetadata.fromCbor(txRecordData[2]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
