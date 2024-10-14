import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { TokenPartitionTransactionType } from '../../../json-rpc/TokenPartitionTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  CreateNonFungibleTokenTypeAttributes,
  CreateNonFungibleTokenTypeAttributesArray,
} from '../../attribute/CreateNonFungibleTokenTypeAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { SubTypeOwnerProofsAuthProof } from '../../proof/SubTypeOwnerProofsAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class CreateNonFungibleTokenTypeTransactionOrder extends TransactionOrder<
  CreateNonFungibleTokenTypeAttributes,
  SubTypeOwnerProofsAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<CreateNonFungibleTokenTypeAttributes>,
    authProof: SubTypeOwnerProofsAuthProof,
    feeProof: OwnerProofAuthProof,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
  }

  public static async fromArray(
    [
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
    ]: TransactionOrderArray,
    cborCodec: ICborCodec,
  ): Promise<CreateNonFungibleTokenTypeTransactionOrder> {
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
      await SubTypeOwnerProofsAuthProof.decode(authProof, cborCodec),
      await OwnerProofAuthProof.decode(feeProof, cborCodec),
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
