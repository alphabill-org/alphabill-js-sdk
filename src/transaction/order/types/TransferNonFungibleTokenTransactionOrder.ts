import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { TokenPartitionTransactionType } from '../../../json-rpc/TokenPartitionTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  TransferNonFungibleTokenAttributes,
  TransferNonFungibleTokenAttributesArray
} from '../../attribute/TransferNonFungibleTokenAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';
import { TokenTypeOwnerProofsAuthProof } from '../../proof/TokenTypeOwnerProofsAuthProof.js';

export class TransferNonFungibleTokenTransactionOrder extends TransactionOrder<
  TransferNonFungibleTokenAttributes,
  TokenTypeOwnerProofsAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<TransferNonFungibleTokenAttributes>,
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
  ): Promise<TransferNonFungibleTokenTransactionOrder> {
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
      authProof ? await TokenTypeOwnerProofsAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
