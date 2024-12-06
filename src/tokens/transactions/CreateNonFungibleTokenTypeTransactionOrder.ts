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
    stateUnlock: IPredicate | null,
    authProof: SubTypeOwnerProofsAuthProof,
    feeProof: Uint8Array | null,
  ) {
    super(version, payload, stateUnlock, authProof, feeProof);
  }

  public static fromCbor(rawData: Uint8Array): CreateNonFungibleTokenTypeTransactionOrder {
    const data = CborDecoder.readArray(CborDecoder.readTag(rawData).data);
    return new CreateNonFungibleTokenTypeTransactionOrder(
      CborDecoder.readUnsignedInteger(data[0]),
      new TransactionPayload(
        Number(CborDecoder.readUnsignedInteger(data[1])),
        Number(CborDecoder.readUnsignedInteger(data[2])),
        UnitId.fromBytes(CborDecoder.readByteString(data[3])),
        TokenPartitionTransactionType.CreateNonFungibleTokenType,
        CreateNonFungibleTokenTypeAttributes.fromCbor(data[5]),
        CborDecoder.readOptional(data[6], StateLock.fromCbor),
        ClientMetadata.fromCbor(data[7]),
      ),
      CborDecoder.readOptional(data[8], PredicateBytes.fromCbor),
      SubTypeOwnerProofsAuthProof.fromCbor(data[9]),
      CborDecoder.readOptional(data[10], CborDecoder.readByteString),
    );
  }
}
