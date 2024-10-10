import { PredicateBytes } from '../../PredicateBytes';
import { TransferNonFungibleTokenAttributes } from '../attribute/TransferNonFungibleTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class TransferNonFungibleTokenTransactionOrder extends TransactionOrder<TransferNonFungibleTokenAttributes> {
  public constructor(
    payload: TransactionPayload<TransferNonFungibleTokenAttributes>,
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
  ]: TransactionOrderArray): TransferNonFungibleTokenTransactionOrder {
    return new TransferNonFungibleTokenTransactionOrder(
      TransactionPayload.fromArray(payload, TransferNonFungibleTokenAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
