import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { TransferFungibleTokenTransactionOrder } from '../TransferFungibleTokenTransactionOrder.js';

export class TransferFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<TransferFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): TransferFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new TransferFungibleTokenTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], TransferFungibleTokenTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
