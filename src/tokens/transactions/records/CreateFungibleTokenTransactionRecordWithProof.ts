import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { CreateFungibleTokenTransactionOrder } from '../CreateFungibleTokenTransactionOrder.js';

export class CreateFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<CreateFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): CreateFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new CreateFungibleTokenTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], CreateFungibleTokenTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
