import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { CreateNonFungibleTokenTransactionOrder } from './CreateNonFungibleTokenTransactionOrder.js';

export class CreateNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<CreateNonFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CreateNonFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txRecordData = CborDecoder.readArray(CborDecoder.readTag(data[0]).data);
    return new CreateNonFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        CborDecoder.readUnsignedInteger(txRecordData[0]),
        CreateNonFungibleTokenTransactionOrder.fromCbor(txRecordData[1]),
        ServerMetadata.fromCbor(txRecordData[2]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
