import { CborDecoder } from '../../../codec/cbor/CborDecoder.js';
import { TransactionProof } from '../../../transaction/record/TransactionProof.js';
import { TransactionRecord } from '../../../transaction/record/TransactionRecord.js';
import { TransactionRecordWithProof } from '../../../transaction/record/TransactionRecordWithProof.js';
import { JoinFungibleTokenTransactionOrder } from '../JoinFungibleTokenTransactionOrder.js';

export class JoinFungibleTokenTransactionRecordWithProof extends TransactionRecordWithProof<JoinFungibleTokenTransactionOrder> {
  public static fromCbor(rawData: Uint8Array): JoinFungibleTokenTransactionRecordWithProof {
    const data = CborDecoder.readArray(rawData);
    return new JoinFungibleTokenTransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], JoinFungibleTokenTransactionOrder),
      TransactionProof.fromCbor(data[1]),
    );
  }
}
