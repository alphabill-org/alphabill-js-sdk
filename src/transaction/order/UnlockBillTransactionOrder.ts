import { PredicateBytes } from '../../PredicateBytes';
import { UnlockBillAttributes } from '../attribute/UnlockBillAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class UnlockBillTransactionOrder extends TransactionOrder<UnlockBillAttributes> {
  public constructor(
    payload: TransactionPayload<UnlockBillAttributes>,
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
  ]: TransactionOrderArray): UnlockBillTransactionOrder {
    return new UnlockBillTransactionOrder(
      TransactionPayload.fromArray(payload, UnlockBillAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
