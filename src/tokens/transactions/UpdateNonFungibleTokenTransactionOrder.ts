import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder, TransactionOrderArray } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import {
  TypeDataUpdateProofsAuthProof,
  TypeDataUpdateProofsAuthProofArray,
} from '../../transaction/proofs/TypeDataUpdateProofsAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import {
  UpdateNonFungibleTokenAttributes,
  UpdateNonFungibleTokenAttributesArray,
} from '../attributes/UpdateNonFungibleTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class UpdateNonFungibleTokenTransactionOrder extends TransactionOrder<
  UpdateNonFungibleTokenAttributes,
  TypeDataUpdateProofsAuthProof
> {
  public constructor(
    payload: TransactionPayload<UpdateNonFungibleTokenAttributes>,
    authProof: TypeDataUpdateProofsAuthProof,
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
  ]: TransactionOrderArray): Promise<UpdateNonFungibleTokenTransactionOrder> {
    return new UpdateNonFungibleTokenTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        TokenPartitionTransactionType.UpdateNonFungibleToken,
        UpdateNonFungibleTokenAttributes.fromArray(attributes as UpdateNonFungibleTokenAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await TypeDataUpdateProofsAuthProof.decode(authProof as TypeDataUpdateProofsAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
