import { FeeCreditTransactionType } from '../../../json-rpc/FeeCreditTransactionType.js';
import { UnitId } from '../../../UnitId.js';
import {
  UnlockFeeCreditAttributes,
  UnlockFeeCreditAttributesArray,
} from '../../attribute/UnlockFeeCreditAttributes.js';
import { ClientMetadata } from '../../ClientMetadata.js';
import { IPredicate } from '../../predicate/IPredicate.js';
import { PredicateBytes } from '../../predicate/PredicateBytes.js';
import { OwnerProofAuthProof, OwnerProofAuthProofArray } from '../../proof/OwnerProofAuthProof.js';
import { StateLock } from '../../StateLock.js';
import { TransactionPayload } from '../../TransactionPayload.js';
import { TransactionOrder, TransactionOrderArray } from '../TransactionOrder.js';

export class UnlockFeeCreditTransactionOrder extends TransactionOrder<UnlockFeeCreditAttributes, OwnerProofAuthProof> {
  public constructor(
    payload: TransactionPayload<UnlockFeeCreditAttributes>,
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
  ]: TransactionOrderArray): Promise<UnlockFeeCreditTransactionOrder> {
    return new UnlockFeeCreditTransactionOrder(
      new TransactionPayload(
        networkIdentifier,
        systemIdentifier,
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
