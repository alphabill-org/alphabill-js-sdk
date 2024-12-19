import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { SplitFungibleTokenTransactionOrder } from '../SplitFungibleTokenTransactionOrder.js';

export class SplitFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<SplitFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): SplitFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new SplitFungibleTokenTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], SplitFungibleTokenTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
