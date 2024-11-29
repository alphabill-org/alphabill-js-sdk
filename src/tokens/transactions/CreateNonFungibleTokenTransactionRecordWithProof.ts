import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ServerMetadata } from '../../transaction/record/ServerMetadata.js';
import { TransactionProof } from '../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { CreateNonFungibleTokenTransactionOrder } from './CreateNonFungibleTokenTransactionOrder.js';

export class CreateNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<CreateNonFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CreateNonFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    const txOrderData = CborDecoder.readArray(data[0]);
    return new CreateNonFungibleTokenTransactionRecordWithProof(
      new TransactionRecord(
        CreateNonFungibleTokenTransactionOrder.fromCbor(txOrderData[0]),
        ServerMetadata.fromCbor(txOrderData[1]),
      ),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
