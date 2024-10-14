import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { TokenPartitionTransactionType } from '../../../json-rpc/TokenPartitionTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  SplitFungibleTokenAttributes,
  SplitFungibleTokenAttributesArray,
} from '../../attribute/SplitFungibleTokenAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';
import { TokenTypeOwnerProofsAuthProof } from '../../proof/TokenTypeOwnerProofsAuthProof';

export class SplitFungibleTokenTransactionOrder extends TransactionOrder<
  SplitFungibleTokenAttributes,
  TokenTypeOwnerProofsAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<SplitFungibleTokenAttributes>,
    authProof: TokenTypeOwnerProofsAuthProof | null,
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
  ): Promise<SplitFungibleTokenTransactionOrder> {
    return new SplitFungibleTokenTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        TokenPartitionTransactionType.SplitFungibleToken,
        SplitFungibleTokenAttributes.fromArray(attributes as SplitFungibleTokenAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      authProof ? await TokenTypeOwnerProofsAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
