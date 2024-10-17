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
  TransferFungibleTokenAttributes,
  TransferFungibleTokenAttributesArray,
} from '../attributes/TransferFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class TransferFungibleTokenTransactionOrder extends TransactionOrder<
  TransferFungibleTokenAttributes,
  TypeOwnerProofsAuthProof
> {
  public constructor(
    payload: TransactionPayload<TransferFungibleTokenAttributes>,
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
  ]: TransactionOrderArray): Promise<TransferFungibleTokenTransactionOrder> {
    return new TransferFungibleTokenTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        TokenPartitionTransactionType.TransferFungibleToken,
        TransferFungibleTokenAttributes.fromArray(attributes as TransferFungibleTokenAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await TypeOwnerProofsAuthProof.decode(authProof as TypeOwnerProofsAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
