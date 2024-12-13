import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from './CreateNonFungibleTokenTypeTransactionOrder.js';

export class CreateNonFungibleTokenTypeTransactionRecordWithProof extends TransactionRecordWithProof<CreateNonFungibleTokenTypeTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CreateNonFungibleTokenTypeTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txRecordData = CborDecoder.readArray(CborDecoder.readTag(data[0]).data);
    return new CreateNonFungibleTokenTypeTransactionRecordWithProof(
      new TransactionRecord(
        CborDecoder.readUnsignedInteger(txRecordData[0]),
        CreateNonFungibleTokenTypeTransactionOrder.fromCbor(txRecordData[1]),
        ServerMetadata.fromCbor(txRecordData[2]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
