import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { TransferNonFungibleTokenTransactionOrder } from '../TransferNonFungibleTokenTransactionOrder.js';

export class TransferNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<TransferNonFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): TransferNonFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new TransferNonFungibleTokenTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], TransferNonFungibleTokenTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
