import { PredicateBytes } from '../../PredicateBytes';
import { SplitBillAttributes } from '../attribute/SplitBillAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class SplitBillTransactionOrder extends TransactionOrder<SplitBillAttributes> {
  public constructor(
    payload: TransactionPayload<SplitBillAttributes>,
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
  ]: TransactionOrderArray): SplitBillTransactionOrder {
    return new SplitBillTransactionOrder(
      TransactionPayload.fromArray(payload, SplitBillAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
