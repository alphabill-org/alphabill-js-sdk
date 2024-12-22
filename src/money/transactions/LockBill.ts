import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofTransactionOrder } from '../../transaction/OwnerProofTransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { LockBillAttributes } from '../attributes/LockBillAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';

export type LockBillTransactionOrder = TransactionOrder<LockBillAttributes, OwnerProofAuthProof>;
export interface ILockBillTransactionData extends ITransactionData {
  status: bigint;
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class LockBill {
  public static create(data: ILockBillTransactionData): OwnerProofTransactionOrder<LockBillAttributes> {
    return new OwnerProofTransactionOrder(
      data.version,
      new TransactionPayload<LockBillAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.LockBill,
        new LockBillAttributes(data.status, data.bill.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<LockBillTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, LockBillAttributes, OwnerProofAuthProof);
  }
}
