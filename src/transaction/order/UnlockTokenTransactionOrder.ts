import { PredicateBytes } from '../../PredicateBytes';
import { UnlockTokenAttributes } from '../attribute/UnlockTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class UnlockTokenTransactionOrder extends TransactionOrder<UnlockTokenAttributes> {
  public constructor(
    payload: TransactionPayload<UnlockTokenAttributes>,
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
  ]: TransactionOrderArray): UnlockTokenTransactionOrder {
    return new UnlockTokenTransactionOrder(
      TransactionPayload.fromArray(payload, UnlockTokenAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
