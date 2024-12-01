import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { SubTypeOwnerProofsAuthProof } from '../../transaction/proofs/SubTypeOwnerProofsAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import { CreateNonFungibleTokenTypeAttributes } from '../attributes/CreateNonFungibleTokenTypeAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class CreateNonFungibleTokenTypeTransactionOrder extends TransactionOrder<
  CreateNonFungibleTokenTypeAttributes,
  SubTypeOwnerProofsAuthProof
> {
  public constructor(
    version: bigint,
    payload: TransactionPayload<CreateNonFungibleTokenTypeAttributes>,
    authProof: SubTypeOwnerProofsAuthProof,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(version, payload, authProof, feeProof, stateUnlock);
  }

  public static fromCbor(rawData: Uint8Array): CreateNonFungibleTokenTypeTransactionOrder {
    const data = CborDecoder.readArray(rawData);
    return new CreateNonFungibleTokenTypeTransactionOrder(
      CborDecoder.readUnsignedInteger(data[0]),
      new TransactionPayload(
        Number(CborDecoder.readUnsignedInteger(data[1])),
        Number(CborDecoder.readUnsignedInteger(data[2])),
        UnitId.fromBytes(CborDecoder.readByteString(data[3])),
        TokenPartitionTransactionType.CreateNonFungibleTokenType,
        CreateNonFungibleTokenTypeAttributes.fromCbor(data[5]),
        data[6] ? StateLock.fromCbor(data[6]) : null,
        ClientMetadata.fromCbor(data[7]),
      ),
      SubTypeOwnerProofsAuthProof.fromCbor(data[7]),
      CborDecoder.readByteString(data[8]),
      data[10] ? new PredicateBytes(CborDecoder.readByteString(data[10])) : null,
    );
  }
}
