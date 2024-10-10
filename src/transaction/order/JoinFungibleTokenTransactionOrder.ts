import { PredicateBytes } from '../../PredicateBytes';
import { JoinFungibleTokenAttributes } from '../attribute/JoinFungibleTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class JoinFungibleTokenTransactionOrder extends TransactionOrder<JoinFungibleTokenAttributes> {
  public constructor(
    payload: TransactionPayload<JoinFungibleTokenAttributes>,
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
  ]: TransactionOrderArray): JoinFungibleTokenTransactionOrder {
    return new JoinFungibleTokenTransactionOrder(
      TransactionPayload.fromArray(payload, JoinFungibleTokenAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
