import { PredicateBytes } from "../../PredicateBytes";
import { SplitFungibleTokenAttributes } from "../attribute/SplitFungibleTokenAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { TransactionOrder } from "./TransactionOrder";
import { TransactionOrderArray } from './TransactionOrderArray';

export class SplitFungibleTokenTransactionOrder extends TransactionOrder<SplitFungibleTokenAttributes> {
    public constructor(
        payload: TransactionPayload<SplitFungibleTokenAttributes>,
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
      ]: TransactionOrderArray): SplitFungibleTokenTransactionOrder {
        return new SplitFungibleTokenTransactionOrder(
          TransactionPayload.fromArray(payload, SplitFungibleTokenAttributes.fromArray),
          ownerProof,
          feeProof,
          stateUnlock ? new PredicateBytes(stateUnlock) : null,
        );
      }
}