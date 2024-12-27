import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofUnsignedTransactionOrder.js';
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
  ): OwnerProofUnsignedTransactionOrder<TransferBillToDustCollectorAttributes> {
    return new OwnerProofUnsignedTransactionOrder(
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
        ClientMetadata.create(data.metadata),
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
