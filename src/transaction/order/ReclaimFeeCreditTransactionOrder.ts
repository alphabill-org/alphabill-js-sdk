import { PredicateBytes } from "../../PredicateBytes";
import { ReclaimFeeCreditAttributes } from "../attribute/ReclaimFeeCreditAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionPayload } from "../TransactionPayload";
import { TransactionOrder } from "./TransactionOrder";
import { TransactionOrderArray } from './TransactionOrderArray';

export class ReclaimFeeCreditTransactionOrder extends TransactionOrder<ReclaimFeeCreditAttributes> {
    public constructor(
        payload: TransactionPayload<ReclaimFeeCreditAttributes>,
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
      ]: TransactionOrderArray): ReclaimFeeCreditTransactionOrder {
        return new ReclaimFeeCreditTransactionOrder(
          TransactionPayload.fromArray(payload, ReclaimFeeCreditAttributes.fromArray),
          ownerProof,
          feeProof,
          stateUnlock ? new PredicateBytes(stateUnlock) : null,
        );
      }
}