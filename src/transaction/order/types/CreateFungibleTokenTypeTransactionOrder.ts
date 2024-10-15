import { TokenPartitionTransactionType } from '../../../json-rpc/TokenPartitionTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  CreateFungibleTokenTypeAttributes,
  CreateFungibleTokenTypeAttributesArray,
} from '../../attribute/CreateFungibleTokenTypeAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import {
  SubTypeOwnerProofsAuthProof,
  SubTypeOwnerProofsAuthProofArray,
} from '../../proof/SubTypeOwnerProofsAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class CreateFungibleTokenTypeTransactionOrder extends TransactionOrder<
  CreateFungibleTokenTypeAttributes,
  SubTypeOwnerProofsAuthProof
> {
  public constructor(
    payload: TransactionPayload<CreateFungibleTokenTypeAttributes>,
    authProof: SubTypeOwnerProofsAuthProof,
    feeProof: Uint8Array,
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
  ]: TransactionOrderArray): Promise<CreateFungibleTokenTypeTransactionOrder> {
    return new CreateFungibleTokenTypeTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
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
