import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { TokenPartitionTransactionType } from '../../../json-rpc/TokenPartitionTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  CreateNonFungibleTokenAttributes,
  CreateNonFungibleTokenAttributesArray,
} from '../../attribute/CreateNonFungibleTokenAttributes.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class CreateNonFungibleTokenTransactionOrder extends TransactionOrder<
  CreateNonFungibleTokenAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<CreateNonFungibleTokenAttributes>,
    authProof: OwnerProofAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(TokenPartitionTransactionType.CreateNonFungibleToken, payload, authProof, feeProof, stateUnlock);
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
  ): Promise<CreateNonFungibleTokenTransactionOrder> {
    return new CreateNonFungibleTokenTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        CreateNonFungibleTokenAttributes.fromArray(attributes as CreateNonFungibleTokenAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        TransactionOrder.decodeClientMetadata(clientMetadata),
      ),
      authProof ? await OwnerProofAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
