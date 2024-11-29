import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from './CreateNonFungibleTokenTypeTransactionOrder.js';

export class CreateNonFungibleTokenTypeTransactionRecordWithProof extends TransactionRecordWithProof<CreateNonFungibleTokenTypeTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CreateNonFungibleTokenTypeTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txOrderData = CborDecoder.readArray(data[0]);
    return new CreateNonFungibleTokenTypeTransactionRecordWithProof(
      new TransactionRecord(
        CreateNonFungibleTokenTypeTransactionOrder.fromCbor(txOrderData[0]),
        ServerMetadata.fromCbor(txOrderData[1]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
