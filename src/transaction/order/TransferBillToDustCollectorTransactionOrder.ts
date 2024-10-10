import { PredicateBytes } from '../../PredicateBytes';
import { TransferBillToDustCollectorAttributes } from '../attribute/TransferBillToDustCollectorAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class TransferBillToDustCollectorTransactionOrder extends TransactionOrder<TransferBillToDustCollectorAttributes> {
  public constructor(
    payload: TransactionPayload<TransferBillToDustCollectorAttributes>,
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
  ]: TransactionOrderArray): TransferBillToDustCollectorTransactionOrder {
    return new TransferBillToDustCollectorTransactionOrder(
      TransactionPayload.fromArray(payload, TransferBillToDustCollectorAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
