import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofUnsignedTransactionOrder.js';
import { SplitBillAttributes } from '../attributes/SplitBillAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';
import { SplitBillUnit } from '../SplitBillUnit.js';

export type SplitBillTransactionOrder = TransactionOrder<SplitBillAttributes, OwnerProofAuthProof>;
export interface ISplitBillTransactionData extends ITransactionData {
  splits: {
    value: bigint;
    ownerPredicate: IPredicate;
  }[];
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class SplitBill {
  public static create(data: ISplitBillTransactionData): OwnerProofUnsignedTransactionOrder<SplitBillAttributes> {
    return new OwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<SplitBillAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.SplitBill,
        new SplitBillAttributes(
          data.splits.map(({ value, ownerPredicate }) => new SplitBillUnit(value, ownerPredicate)),
          data.bill.counter,
        ),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<SplitBillTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, SplitBillAttributes, OwnerProofAuthProof);
  }
}
