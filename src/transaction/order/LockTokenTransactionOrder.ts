import { PredicateBytes } from '../../PredicateBytes';
import { LockTokenAttributes } from '../attribute/LockTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class LockTokenTransactionOrder extends TransactionOrder<LockTokenAttributes> {
  public constructor(
    payload: TransactionPayload<LockTokenAttributes>,
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
  ]: TransactionOrderArray): LockTokenTransactionOrder {
    return new LockTokenTransactionOrder(
      TransactionPayload.fromArray(payload, LockTokenAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
