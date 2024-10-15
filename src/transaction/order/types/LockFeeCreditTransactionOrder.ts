import { FeeCreditTransactionType } from '../../../json-rpc/FeeCreditTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import { LockFeeCreditAttributes, LockFeeCreditAttributesArray } from '../../attribute/LockFeeCreditAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof, OwnerProofAuthProofArray } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class LockFeeCreditTransactionOrder extends TransactionOrder<LockFeeCreditAttributes, OwnerProofAuthProof> {
  public constructor(
    payload: TransactionPayload<LockFeeCreditAttributes>,
    authProof: OwnerProofAuthProof,
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
  ]: TransactionOrderArray): Promise<LockFeeCreditTransactionOrder> {
    return new LockFeeCreditTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
        UnitId.fromBytes(unitId),
        FeeCreditTransactionType.LockFeeCredit,
        LockFeeCreditAttributes.fromArray(attributes as LockFeeCreditAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await OwnerProofAuthProof.decode(authProof as OwnerProofAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
