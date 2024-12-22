import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofTransactionOrder } from '../../transaction/OwnerProofTransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TransferBillToDustCollectorAttributes } from '../attributes/TransferBillToDustCollectorAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';

export type TransferBillToDustCollectorTransactionOrder = TransactionOrder<
  TransferBillToDustCollectorAttributes,
  OwnerProofAuthProof
>;
export interface ITransferBillToDustCollectorTransactionData extends ITransactionData {
  bill: {
    unitId: IUnitId;
    counter: bigint;
    value: bigint;
  };
  targetBill: {
    unitId: IUnitId;
    counter: bigint;
    value: bigint;
  };
}

export class TransferBillToDustCollector {
  public static create(
    data: ITransferBillToDustCollectorTransactionData,
  ): OwnerProofTransactionOrder<TransferBillToDustCollectorAttributes> {
    return new OwnerProofTransactionOrder(
      data.version,
      new TransactionPayload<TransferBillToDustCollectorAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.TransferBillToDustCollector,
        new TransferBillToDustCollectorAttributes(
          data.bill.value,
          data.targetBill.unitId,
          data.targetBill.counter,
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
  ): TransactionRecordWithProof<TransferBillToDustCollectorTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, TransferBillToDustCollectorAttributes, OwnerProofAuthProof);
  }
}
