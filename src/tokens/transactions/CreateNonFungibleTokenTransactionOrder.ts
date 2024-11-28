import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import { CreateNonFungibleTokenAttributes } from '../attributes/CreateNonFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class CreateNonFungibleTokenTransactionOrder extends TransactionOrder<
  CreateNonFungibleTokenAttributes,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<CreateNonFungibleTokenAttributes>,
    authProof: OwnerProofAuthProof,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
  }

  public static async fromCbor(rawData: Uint8Array): Promise<CreateNonFungibleTokenTransactionOrder> {
    const data = CborDecoder.readArray(rawData);
    return new CreateNonFungibleTokenTransactionOrder(
      new TransactionPayload(
        Number(CborDecoder.readUnsignedInteger(data[0])),
        Number(CborDecoder.readUnsignedInteger(data[1])),
        UnitId.fromBytes(CborDecoder.readByteString(data[2])),
        TokenPartitionTransactionType.CreateNonFungibleToken,
        CreateNonFungibleTokenAttributes.fromCbor(data[4]),
        data[5] ? StateLock.fromCbor(data[5]) : null,
        ClientMetadata.fromCbor(data[6]),
      ),
      await OwnerProofAuthProof.fromCbor(data[7]),
      CborDecoder.readByteString(data[8]),
      data[9] ? new PredicateBytes(CborDecoder.readByteString(data[9])) : null,
    );
  }
}
