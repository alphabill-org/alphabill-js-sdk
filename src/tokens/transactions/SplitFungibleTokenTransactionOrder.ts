import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder, TransactionOrderArray } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import {
  TypeOwnerProofsAuthProof,
  TypeOwnerProofsAuthProofArray,
} from '../../transaction/proofs/TypeOwnerProofsAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import {
  SplitFungibleTokenAttributes,
  SplitFungibleTokenAttributesArray,
} from '../attributes/SplitFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class SplitFungibleTokenTransactionOrder extends TransactionOrder<
  SplitFungibleTokenAttributes,
  TypeOwnerProofsAuthProof
> {
  public constructor(
    payload: TransactionPayload<SplitFungibleTokenAttributes>,
    authProof: TypeOwnerProofsAuthProof,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
  }

  public static async fromArray([
    networkIdentifier,
    partitionIdentifier,
    unitId,
    ,
    attributes,
    stateLock,
    clientMetadata,
    stateUnlock,
    authProof,
    feeProof,
  ]: TransactionOrderArray): Promise<SplitFungibleTokenTransactionOrder> {
    return new SplitFungibleTokenTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        partitionIdentifier,
        UnitId.fromBytes(unitId),
        TokenPartitionTransactionType.SplitFungibleToken,
        SplitFungibleTokenAttributes.fromArray(attributes as SplitFungibleTokenAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await TypeOwnerProofsAuthProof.decode(authProof as TypeOwnerProofsAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
