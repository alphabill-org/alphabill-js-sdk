import { PredicateBytes } from '../../PredicateBytes';
import { TransferBillAttributes } from '../attribute/TransferBillAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class TransferBillTransactionOrder extends TransactionOrder<TransferBillAttributes> {
  public constructor(
    payload: TransactionPayload<TransferBillAttributes>,
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
  ]: TransactionOrderArray): TransferBillTransactionOrder {
    return new TransferBillTransactionOrder(
      TransactionPayload.fromArray(payload, TransferBillAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
