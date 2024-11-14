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
  CreateFungibleTokenTypeAttributes,
  CreateFungibleTokenTypeAttributesArray,
} from '../attributes/CreateFungibleTokenTypeAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';

export class CreateFungibleTokenTypeTransactionOrder extends TransactionOrder<
  CreateFungibleTokenTypeAttributes,
  SubTypeOwnerProofsAuthProof
> {
  public constructor(
    payload: TransactionPayload<CreateFungibleTokenTypeAttributes>,
    authProof: SubTypeOwnerProofsAuthProof,
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
  ]: TransactionOrderArray): Promise<CreateFungibleTokenTypeTransactionOrder> {
    return new CreateFungibleTokenTypeTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        partitionIdentifier,
        UnitId.fromBytes(unitId),
        TokenPartitionTransactionType.CreateFungibleTokenType,
        CreateFungibleTokenTypeAttributes.fromArray(attributes as CreateFungibleTokenTypeAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await SubTypeOwnerProofsAuthProof.decode(authProof as SubTypeOwnerProofsAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
