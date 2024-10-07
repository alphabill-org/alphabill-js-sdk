import { PredicateBytes } from "../../PredicateBytes";
import { TransferFungibleTokenAttributes } from "../attribute/TransferFungibleTokenAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { TransactionOrder } from "./TransactionOrder";
import { TransactionOrderArray } from './TransactionOrderArray';

export class TransferFungibleTokenTransactionOrder extends TransactionOrder<TransferFungibleTokenAttributes> {
    public constructor(
        payload: TransactionPayload<TransferFungibleTokenAttributes>,
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
      ]: TransactionOrderArray): TransferFungibleTokenTransactionOrder {
        return new TransferFungibleTokenTransactionOrder(
          TransactionPayload.fromArray(payload, TransferFungibleTokenAttributes.fromArray),
          ownerProof,
          feeProof,
          stateUnlock ? new PredicateBytes(stateUnlock) : null,
        );
      }
}