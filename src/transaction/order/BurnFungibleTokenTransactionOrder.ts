import { PredicateBytes } from "../../PredicateBytes";
import { BurnFungibleTokenAttributes } from "../attribute/BurnFungibleTokenAttributes";
import { IPredicate } from "../IPredicate";
import { TransactionOrderType } from '../TransactionOrderType';
import { TransactionPayload } from "../TransactionPayload";
import { TransactionOrder } from "./TransactionOrder";
import { TransactionOrderArray } from './TransactionOrderArray';

export class BurnFungibleTokenTransactionOrder extends TransactionOrder<BurnFungibleTokenAttributes> {
    public constructor(
        payload: TransactionPayload<BurnFungibleTokenAttributes>,
        transactionProof: Uint8Array | null,
        feeProof: Uint8Array | null,
        stateUnlock: IPredicate | null,
    ) {
        super(payload, transactionProof, feeProof, stateUnlock);
    }

  public get type(): TransactionOrderType {
    return TransactionOrderType.BurnFungibleToken;
  }

    public static fromArray([
        payload,
        ownerProof,
        feeProof,
        stateUnlock,
      ]: TransactionOrderArray): BurnFungibleTokenTransactionOrder {
        return new BurnFungibleTokenTransactionOrder(
          TransactionPayload.fromArray(payload, BurnFungibleTokenAttributes.fromArray),
          ownerProof,
          feeProof,
          stateUnlock ? new PredicateBytes(stateUnlock) : null,
        );
      }
}