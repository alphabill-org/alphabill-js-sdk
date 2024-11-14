import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder, TransactionOrderArray } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { OwnerProofAuthProof, OwnerProofAuthProofArray } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import { UnlockFeeCreditAttributes, UnlockFeeCreditAttributesArray } from '../attributes/UnlockFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';

export class UnlockFeeCreditTransactionOrder extends TransactionOrder<UnlockFeeCreditAttributes, OwnerProofAuthProof> {
  public constructor(
    payload: TransactionPayload<UnlockFeeCreditAttributes>,
    authProof: OwnerProofAuthProof,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, authProof, feeProof, stateUnlock);
  }

  public static async fromArray([
    networkIdentifier,
    partitionIdentifier,
    unitId,
    ,
    attributes,
    stateLock,
    clientMetadata,
    stateUnlock,
    authProof,
    feeProof,
  ]: TransactionOrderArray): Promise<UnlockFeeCreditTransactionOrder> {
    return new UnlockFeeCreditTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        partitionIdentifier,
        UnitId.fromBytes(unitId),
        FeeCreditTransactionType.UnlockFeeCredit,
        UnlockFeeCreditAttributes.fromArray(attributes as UnlockFeeCreditAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await OwnerProofAuthProof.decode(authProof as OwnerProofAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
