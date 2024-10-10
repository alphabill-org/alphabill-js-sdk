import { PredicateBytes } from '../../PredicateBytes';
import { UpdateNonFungibleTokenAttributes } from '../attribute/UpdateNonFungibleTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { TransactionOrder } from './TransactionOrder';
import { TransactionOrderArray } from './TransactionOrderArray';

export class UpdateNonFungibleTokenTransactionOrder extends TransactionOrder<UpdateNonFungibleTokenAttributes> {
  public constructor(
    payload: TransactionPayload<UpdateNonFungibleTokenAttributes>,
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
  ]: TransactionOrderArray): UpdateNonFungibleTokenTransactionOrder {
    return new UpdateNonFungibleTokenTransactionOrder(
      TransactionPayload.fromArray(payload, UpdateNonFungibleTokenAttributes.fromArray),
      ownerProof,
      feeProof,
      stateUnlock ? new PredicateBytes(stateUnlock) : null,
    );
  }
}
