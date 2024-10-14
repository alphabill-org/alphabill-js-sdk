import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { TokenPartitionTransactionType } from '../../../json-rpc/TokenPartitionTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  CreateFungibleTokenTypeAttributes,
  CreateFungibleTokenTypeAttributesArray,
} from '../../attribute/CreateFungibleTokenTypeAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';
import { SubTypeOwnerProofsAuthProof } from '../../proof/SubTypeOwnerProofsAuthProof';

export class CreateFungibleTokenTypeTransactionOrder extends TransactionOrder<
  CreateFungibleTokenTypeAttributes,
  SubTypeOwnerProofsAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<CreateFungibleTokenTypeAttributes>,
    authProof: SubTypeOwnerProofsAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
  }

  public static async fromArray(
    [
      [networkIdentifier, systemIdentifier, unitId, , attributes, stateLock, clientMetadata],
      stateUnlock,
      authProof,
      feeProof,
    ]: TransactionOrderArray,
    cborCodec: ICborCodec,
  ): Promise<CreateFungibleTokenTypeTransactionOrder> {
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
      authProof ? await SubTypeOwnerProofsAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
