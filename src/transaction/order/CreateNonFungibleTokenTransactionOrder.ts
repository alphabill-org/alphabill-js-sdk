import { PredicateBytes } from "../../PredicateBytes";
import { CreateNonFungibleTokenAttributes } from "../attribute/CreateNonFungibleTokenAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { TransactionOrder } from "./TransactionOrder";
import { TransactionOrderArray } from './TransactionOrderArray';

export class CreateNonFungibleTokenTransactionOrder extends TransactionOrder<CreateNonFungibleTokenAttributes> {
    public constructor(
        payload: TransactionPayload<CreateNonFungibleTokenAttributes>,
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
      ]: TransactionOrderArray): CreateNonFungibleTokenTransactionOrder {
        return new CreateNonFungibleTokenTransactionOrder(
          TransactionPayload.fromArray(payload, CreateNonFungibleTokenAttributes.fromArray),
          ownerProof,
          feeProof,
          stateUnlock ? new PredicateBytes(stateUnlock) : null,
        );
      }
}