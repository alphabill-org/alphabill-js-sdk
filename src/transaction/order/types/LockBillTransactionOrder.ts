import { ICborCodec } from '../../../codec/cbor/ICborCodec.js';
import { UnitId } from '../../../UnitId.js';
import { LockBillAttributes, LockBillAttributesArray } from '../../attribute/LockBillAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class LockBillTransactionOrder extends TransactionOrder<
  LockBillAttributes,
  OwnerProofAuthProof,
  OwnerProofAuthProof
> {
  public constructor(
    payload: TransactionPayload<LockBillAttributes>,
    authProof: OwnerProofAuthProof | null,
    feeProof: OwnerProofAuthProof | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
  }

  public static async fromArray(
    [
      [networkIdentifier, systemIdentifier, unitId, type, attributes, stateLock, clientMetadata],
      stateUnlock,
      authProof,
      feeProof,
    ]: TransactionOrderArray,
    cborCodec: ICborCodec,
  ): Promise<LockBillTransactionOrder> {
    return new LockBillTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        type,
        LockBillAttributes.fromArray(attributes as LockBillAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      authProof ? await OwnerProofAuthProof.decode(authProof, cborCodec) : null,
      feeProof ? await OwnerProofAuthProof.decode(feeProof, cborCodec) : null,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
