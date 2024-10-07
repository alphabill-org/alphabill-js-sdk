import { PredicateBytes } from "../../PredicateBytes";
import { CloseFeeCreditAttributes } from "../attribute/CloseFeeCreditAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { TransactionOrder } from "./TransactionOrder";
import { TransactionOrderArray } from './TransactionOrderArray';

export class CloseFeeCreditTransactionOrder extends TransactionOrder<CloseFeeCreditAttributes> {
    public constructor(
        payload: TransactionPayload<CloseFeeCreditAttributes>,
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
      ]: TransactionOrderArray): CloseFeeCreditTransactionOrder {
        return new CloseFeeCreditTransactionOrder(
          TransactionPayload.fromArray(payload, CloseFeeCreditAttributes.fromArray),
          ownerProof,
          feeProof,
          stateUnlock ? new PredicateBytes(stateUnlock) : null,
        );
      }
}