import { PredicateBytes } from '../../PredicateBytes';
import { LockBillAttributes } from '../attribute/LockBillAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class LockBillTransactionOrder extends TransactionOrder<LockBillAttributes> {
  public constructor(
    payload: TransactionPayload<LockBillAttributes>,
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
  ]: TransactionOrderArray): LockBillTransactionOrder {
    return new LockBillTransactionOrder(
      TransactionPayload.fromArray(payload, LockBillAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
