import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofUnsignedTransactionOrder.js';
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
  public static create(data: ILockBillTransactionData): OwnerProofUnsignedTransactionOrder<LockBillAttributes> {
    return new OwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<LockBillAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.LockBill,
        new LockBillAttributes(data.status, data.bill.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
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
