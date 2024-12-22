import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofUnsignedTransactionOrder.js';
import { UnlockBillAttributes } from '../attributes/UnlockBillAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';

export type UnlockBillTransactionOrder = TransactionOrder<UnlockBillAttributes, OwnerProofAuthProof>;
export interface IUnlockBillTransactionData extends ITransactionData {
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnlockBill {
  public static create(data: IUnlockBillTransactionData): OwnerProofUnsignedTransactionOrder<UnlockBillAttributes> {
    return new OwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<UnlockBillAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.UnlockBill,
        new UnlockBillAttributes(data.bill.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<UnlockBillTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, UnlockBillAttributes, OwnerProofAuthProof);
  }
}
