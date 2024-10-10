import { PredicateBytes } from '../../PredicateBytes';
import { CreateNonFungibleTokenTypeAttributes } from '../attribute/CreateNonFungibleTokenTypeAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class CreateNonFungibleTokenTypeTransactionOrder extends TransactionOrder<CreateNonFungibleTokenTypeAttributes> {
  public constructor(
    payload: TransactionPayload<CreateNonFungibleTokenTypeAttributes>,
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
  ]: TransactionOrderArray): CreateNonFungibleTokenTypeTransactionOrder {
    return new CreateNonFungibleTokenTypeTransactionOrder(
      TransactionPayload.fromArray(payload, CreateNonFungibleTokenTypeAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
