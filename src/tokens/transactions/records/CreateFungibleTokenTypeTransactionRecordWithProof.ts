import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { CreateFungibleTokenTypeTransactionOrder } from '../CreateFungibleTokenTypeTransactionOrder.js';

export class CreateFungibleTokenTypeTransactionRecordWithProof extends TransactionRecordWithProof<CreateFungibleTokenTypeTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CreateFungibleTokenTypeTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new CreateFungibleTokenTypeTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], CreateFungibleTokenTypeTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
