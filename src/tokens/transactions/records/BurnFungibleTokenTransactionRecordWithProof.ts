import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { BurnFungibleTokenTransactionOrder } from '../BurnFungibleTokenTransactionOrder.js';

export class BurnFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<BurnFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): BurnFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new BurnFungibleTokenTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], BurnFungibleTokenTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
