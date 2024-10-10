import { PredicateBytes } from '../../PredicateBytes';
import { UnlockFeeCreditAttributes } from '../attribute/UnlockFeeCreditAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class UnlockFeeCreditTransactionOrder extends TransactionOrder<UnlockFeeCreditAttributes> {
  public constructor(
    payload: TransactionPayload<UnlockFeeCreditAttributes>,
    ownerProof: Uint8Array | null,
    feeProof: Uint8Array | null,
    stateUnlock: IPredicate | null,
  ) {
    super(payload, ownerProof, feeProof, stateUnlock);
  }

  public static fromArray([
    payload,
    ownerProof,
    feeProof,
    stateUnlock,
  ]: TransactionOrderArray): UnlockFeeCreditTransactionOrder {
    return new UnlockFeeCreditTransactionOrder(
      TransactionPayload.fromArray(payload, UnlockFeeCreditAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
