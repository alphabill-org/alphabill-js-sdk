import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { CreateFungibleTokenTypeTransactionOrder } from './CreateFungibleTokenTypeTransactionOrder.js';

export class CreateFungibleTokenTypeTransactionRecordWithProof extends TransactionRecordWithProof<CreateFungibleTokenTypeTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CreateFungibleTokenTypeTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txRecordData = CborDecoder.readArray(CborDecoder.readTag(data[0]).data);
    return new CreateFungibleTokenTypeTransactionRecordWithProof(
      new TransactionRecord(
        CborDecoder.readUnsignedInteger(txRecordData[0]),
        CreateFungibleTokenTypeTransactionOrder.fromCbor(txRecordData[1]),
        ServerMetadata.fromCbor(txRecordData[2]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
