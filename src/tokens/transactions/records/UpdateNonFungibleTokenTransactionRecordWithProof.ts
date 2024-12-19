import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { UpdateNonFungibleTokenTransactionOrder } from '../UpdateNonFungibleTokenTransactionOrder.js';

export class UpdateNonFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<UpdateNonFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): UpdateNonFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new UpdateNonFungibleTokenTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], UpdateNonFungibleTokenTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
