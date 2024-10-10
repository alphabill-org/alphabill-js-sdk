import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { UnlockTokenAttributes, UnlockTokenAttributesArray } from '../attribute/UnlockTokenAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from './TransactionOrder.js';

export class UnlockTokenTransactionOrder extends TransactionOrder<
  UnlockTokenAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<UnlockTokenAttributes>,
    authProof: OwnerProofAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(TokenPartitionTransactionType.UnlockToken, payload, authProof, feeProof, stateUnlock);
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
  ): Promise<UnlockTokenTransactionOrder> {
    return new UnlockTokenTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        UnlockTokenAttributes.fromArray(attributes as UnlockTokenAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        TransactionOrder.decodeClientMetadata(clientMetadata),
      ),
      authProof ? await OwnerProofAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
