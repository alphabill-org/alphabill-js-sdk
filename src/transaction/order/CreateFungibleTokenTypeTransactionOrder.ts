import { PredicateBytes } from '../../PredicateBytes';
import { CreateFungibleTokenTypeAttributes } from '../attribute/CreateFungibleTokenTypeAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class CreateFungibleTokenTypeTransactionOrder extends TransactionOrder<CreateFungibleTokenTypeAttributes> {
  public constructor(
    payload: TransactionPayload<CreateFungibleTokenTypeAttributes>,
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
  ]: TransactionOrderArray): CreateFungibleTokenTypeTransactionOrder {
    return new CreateFungibleTokenTypeTransactionOrder(
      TransactionPayload.fromArray(payload, CreateFungibleTokenTypeAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
