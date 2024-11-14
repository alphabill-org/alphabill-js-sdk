import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { TransactionOrder, TransactionOrderArray } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { OwnerProofAuthProof, OwnerProofAuthProofArray } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { StateLock } from '../../transaction/StateLock.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitId } from '../../UnitId.js';
import { CloseFeeCreditAttributes, CloseFeeCreditAttributesArray } from '../attributes/CloseFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';

export class CloseFeeCreditTransactionOrder extends TransactionOrder<CloseFeeCreditAttributes, OwnerProofAuthProof> {
  public constructor(
    payload: TransactionPayload<CloseFeeCreditAttributes>,
    ownerProof: OwnerProofAuthProof,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, ownerProof, feeProof, stateUnlock);
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
  ]: TransactionOrderArray): Promise<CloseFeeCreditTransactionOrder> {
    return new CloseFeeCreditTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        partitionIdentifier,
        UnitId.fromBytes(unitId),
        FeeCreditTransactionType.CloseFeeCredit,
        CloseFeeCreditAttributes.fromArray(attributes as CloseFeeCreditAttributesArray),
        stateLock ? StateLock.fromArray(stateLock) : null,
        ClientMetadata.fromArray(clientMetadata),
      ),
      await OwnerProofAuthProof.decode(authProof as OwnerProofAuthProofArray),
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
