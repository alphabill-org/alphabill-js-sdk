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
  JoinFungibleTokenAttributes,
  JoinFungibleTokenAttributesArray,
} from '../attributes/JoinFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class JoinFungibleTokenTransactionOrder extends TransactionOrder<
  JoinFungibleTokenAttributes,
  TypeOwnerProofsAuthProof
> {
  public constructor(
    payload: TransactionPayload<JoinFungibleTokenAttributes>,
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
  ]: TransactionOrderArray): Promise<JoinFungibleTokenTransactionOrder> {
    return new JoinFungibleTokenTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        partitionIdentifier,
        UnitId.fromBytes(unitId),
        TokenPartitionTransactionType.JoinFungibleToken,
        await JoinFungibleTokenAttributes.fromArray(attributes as JoinFungibleTokenAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await TypeOwnerProofsAuthProof.decode(authProof as TypeOwnerProofsAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
