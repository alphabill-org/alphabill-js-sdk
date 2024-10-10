import { PredicateBytes } from '../../PredicateBytes';
import { LockBillAttributes } from '../attribute/LockBillAttributes';
import { LockFeeCreditAttributes } from '../attribute/LockFeeCreditAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class LockFeeCreditTransactionOrder extends TransactionOrder<LockFeeCreditAttributes> {
  public constructor(
    payload: TransactionPayload<LockFeeCreditAttributes>,
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
  ]: TransactionOrderArray): LockFeeCreditTransactionOrder {
    return new LockFeeCreditTransactionOrder(
      TransactionPayload.fromArray(payload, LockBillAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
