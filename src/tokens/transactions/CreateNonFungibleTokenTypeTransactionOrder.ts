import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder, TransactionOrderArray } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import {
  SubTypeOwnerProofsAuthProof,
  SubTypeOwnerProofsAuthProofArray,
} from '../../transaction/proofs/SubTypeOwnerProofsAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import {
  CreateNonFungibleTokenTypeAttributes,
  CreateNonFungibleTokenTypeAttributesArray,
} from '../attributes/CreateNonFungibleTokenTypeAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class CreateNonFungibleTokenTypeTransactionOrder extends TransactionOrder<
  CreateNonFungibleTokenTypeAttributes,
  SubTypeOwnerProofsAuthProof
> {
  public constructor(
    payload: TransactionPayload<CreateNonFungibleTokenTypeAttributes>,
    authProof: SubTypeOwnerProofsAuthProof,
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
  ]: TransactionOrderArray): Promise<CreateNonFungibleTokenTypeTransactionOrder> {
    return new CreateNonFungibleTokenTypeTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        TokenPartitionTransactionType.CreateNonFungibleTokenType,
        CreateNonFungibleTokenTypeAttributes.fromArray(attributes as CreateNonFungibleTokenTypeAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await SubTypeOwnerProofsAuthProof.decode(authProof as SubTypeOwnerProofsAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
