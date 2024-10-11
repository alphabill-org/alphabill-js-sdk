import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { TokenPartitionTransactionType } from '../../../json-rpc/TokenPartitionTransactionType.js';
import { PredicateBytes } from '../../../PredicateBytes.js';
import { UnitId } from '../../../UnitId.js';
import {
  BurnFungibleTokenAttributes,
  BurnFungibleTokenAttributesArray,
} from '../../attribute/BurnFungibleTokenAttributes.js';
import { IPredicate } from '../../IPredicate.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class BurnFungibleTokenTransactionOrder extends TransactionOrder<
  BurnFungibleTokenAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<BurnFungibleTokenAttributes>,
    authProof: OwnerProofAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(TokenPartitionTransactionType.BurnFungibleToken, payload, authProof, feeProof, stateUnlock);
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
  ): Promise<BurnFungibleTokenTransactionOrder> {
    return new BurnFungibleTokenTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        BurnFungibleTokenAttributes.fromArray(attributes as BurnFungibleTokenAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        TransactionOrder.decodeClientMetadata(clientMetadata),
      ),
      authProof ? await OwnerProofAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
