import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { TokenPartitionTransactionType } from '../../../json-rpc/TokenPartitionTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  UpdateNonFungibleTokenAttributes,
  UpdateNonFungibleTokenAttributesArray,
} from '../../attribute/UpdateNonFungibleTokenAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';
import { TokenTypeDataUpdateProofsAuthProof } from '../../proof/TokenTypeDataUpdateProofsAuthProof';

export class UpdateNonFungibleTokenTransactionOrder extends TransactionOrder<
  UpdateNonFungibleTokenAttributes,
  TokenTypeDataUpdateProofsAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<UpdateNonFungibleTokenAttributes>,
    authProof: TokenTypeDataUpdateProofsAuthProof | null,
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
  ): Promise<UpdateNonFungibleTokenTransactionOrder> {
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
      authProof ? await TokenTypeDataUpdateProofsAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
