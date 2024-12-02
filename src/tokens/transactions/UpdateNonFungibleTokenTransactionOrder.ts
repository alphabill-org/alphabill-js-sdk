import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { TypeDataUpdateProofsAuthProof } from '../../transaction/proofs/TypeDataUpdateProofsAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import { UpdateNonFungibleTokenAttributes } from '../attributes/UpdateNonFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class UpdateNonFungibleTokenTransactionOrder extends TransactionOrder<
  UpdateNonFungibleTokenAttributes,
  TypeDataUpdateProofsAuthProof
> {
  public constructor(
    version: bigint,
    payload: TransactionPayload<UpdateNonFungibleTokenAttributes>,
    stateUnlock: IPredicate | null,
    authProof: TypeDataUpdateProofsAuthProof,
    feeProof: Uint8Array | null,
  ) {
    super(version, payload, stateUnlock, authProof, feeProof);
  }

  public static fromCbor(rawData: Uint8Array): UpdateNonFungibleTokenTransactionOrder {
    const data = CborDecoder.readArray(rawData);
    return new UpdateNonFungibleTokenTransactionOrder(
      CborDecoder.readUnsignedInteger(data[0]),
      new TransactionPayload(
        Number(CborDecoder.readUnsignedInteger(data[1])),
        Number(CborDecoder.readUnsignedInteger(data[2])),
        UnitId.fromBytes(CborDecoder.readByteString(data[3])),
        TokenPartitionTransactionType.UpdateNonFungibleToken,
        UpdateNonFungibleTokenAttributes.fromCbor(data[5]),
        CborDecoder.readOptional(data[6], StateLock.fromCbor),
        ClientMetadata.fromCbor(data[7]),
      ),
      CborDecoder.readOptional(data[8], PredicateBytes.fromCbor),
      TypeDataUpdateProofsAuthProof.fromCbor(data[9]),
      CborDecoder.readOptional(data[10], CborDecoder.readByteString),
    );
  }
}
