import { PredicateBytes } from '../../PredicateBytes';
import { CreateFungibleTokenAttributes } from '../attribute/CreateFungibleTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class CreateFungibleTokenTransactionOrder extends TransactionOrder<CreateFungibleTokenAttributes> {
  public constructor(
    payload: TransactionPayload<CreateFungibleTokenAttributes>,
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
  ]: TransactionOrderArray): CreateFungibleTokenTransactionOrder {
    return new CreateFungibleTokenTransactionOrder(
      TransactionPayload.fromArray(payload, CreateFungibleTokenAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
