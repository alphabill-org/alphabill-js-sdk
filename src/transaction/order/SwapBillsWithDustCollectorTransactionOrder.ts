import { PredicateBytes } from '../../PredicateBytes';
import { SwapBillsWithDustCollectorAttributes } from '../attribute/SwapBillsWithDustCollectorAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class SwapBillsWithDustCollectorTransactionOrder extends TransactionOrder<SwapBillsWithDustCollectorAttributes> {
  public constructor(
    payload: TransactionPayload<SwapBillsWithDustCollectorAttributes>,
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
  ]: TransactionOrderArray): SwapBillsWithDustCollectorTransactionOrder {
    return new SwapBillsWithDustCollectorTransactionOrder(
      TransactionPayload.fromArray(payload, SwapBillsWithDustCollectorAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
