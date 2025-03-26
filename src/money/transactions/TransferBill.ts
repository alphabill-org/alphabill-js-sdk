import { IUnitId } from '../../IUnitId.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofUnsignedTransactionOrder.js';
import { TransferBillAttributes } from '../attributes/TransferBillAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';

export type TransferBillTransactionOrder = TransactionOrder<TransferBillAttributes, OwnerProofAuthProof>;
export interface ITransferBillTransactionData extends ITransactionData {
  ownerPredicate: IPredicate;
  bill: {
    unitId: IUnitId;
    counter: bigint;
    value: bigint;
  };
}

export class TransferBill {
  public static create(data: ITransferBillTransactionData): OwnerProofUnsignedTransactionOrder<TransferBillAttributes> {
    return new OwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<TransferBillAttributes>(
        data.networkIdentifier,
        data.partitionIdentifier,
        data.bill.unitId,
        MoneyPartitionTransactionType.TransferBill,
        new TransferBillAttributes(data.bill.value, data.ownerPredicate, data.bill.counter),
        data.stateLock,
        ClientMetadata.create(data.metadata),
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<TransferBillTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, TransferBillAttributes, OwnerProofAuthProof);
  }
}
