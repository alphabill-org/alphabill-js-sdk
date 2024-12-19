import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from '../CreateNonFungibleTokenTypeTransactionOrder.js';

export class CreateNonFungibleTokenTypeTransactionRecordWithProof extends TransactionRecordWithProof<CreateNonFungibleTokenTypeTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CreateNonFungibleTokenTypeTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new CreateNonFungibleTokenTypeTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], CreateNonFungibleTokenTypeTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
