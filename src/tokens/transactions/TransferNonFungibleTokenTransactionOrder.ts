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
  TransferNonFungibleTokenAttributes,
  TransferNonFungibleTokenAttributesArray,
} from '../attributes/TransferNonFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class TransferNonFungibleTokenTransactionOrder extends TransactionOrder<
  TransferNonFungibleTokenAttributes,
  TypeOwnerProofsAuthProof
> {
  public constructor(
    payload: TransactionPayload<TransferNonFungibleTokenAttributes>,
    authProof: TypeOwnerProofsAuthProof,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
  }

  public static async fromArray([
    networkIdentifier,
    systemIdentifier,
    unitId,
    ,
    attributes,
    stateLock,
    clientMetadata,
    stateUnlock,
    authProof,
    feeProof,
  ]: TransactionOrderArray): Promise<TransferNonFungibleTokenTransactionOrder> {
    return new TransferNonFungibleTokenTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        TokenPartitionTransactionType.TransferNonFungibleToken,
        TransferNonFungibleTokenAttributes.fromArray(attributes as TransferNonFungibleTokenAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await TypeOwnerProofsAuthProof.decode(authProof as TypeOwnerProofsAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
