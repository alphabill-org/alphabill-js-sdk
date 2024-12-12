import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { CreateNonFungibleTokenTransactionOrder } from '../CreateNonFungibleTokenTransactionOrder.js';

export class CreateNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<CreateNonFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CreateNonFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new CreateNonFungibleTokenTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], CreateNonFungibleTokenTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
