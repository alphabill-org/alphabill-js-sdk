import { PredicateBytes } from '../../PredicateBytes';
import { TransferFeeCreditAttributes } from '../attribute/TransferFeeCreditAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class TransferFeeCreditTransactionOrder extends TransactionOrder<TransferFeeCreditAttributes> {
  public constructor(
    payload: TransactionPayload<TransferFeeCreditAttributes>,
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
  ]: TransactionOrderArray): TransferFeeCreditTransactionOrder {
    return new TransferFeeCreditTransactionOrder(
      TransactionPayload.fromArray(payload, TransferFeeCreditAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
