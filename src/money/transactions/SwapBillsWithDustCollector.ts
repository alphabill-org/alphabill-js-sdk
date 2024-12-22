import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { TransactionOrder } from '../../transaction/order/TransactionOrder.js';
import { OwnerProofTransactionOrder } from '../../transaction/OwnerProofTransactionOrder.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { SwapBillsWithDustCollectorAttributes } from '../attributes/SwapBillsWithDustCollectorAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';
import { TransferBillToDustCollectorTransactionOrder } from './TransferBillToDustCollector.js';

export type SwapBillsWithDustCollectorTransactionOrder = TransactionOrder<
  SwapBillsWithDustCollectorAttributes,
  OwnerProofAuthProof
>;
export interface ISwapBillsWithDustCollectorTransactionData extends ITransactionData {
  proofs: TransactionRecordWithProof<TransferBillToDustCollectorTransactionOrder>[];
  bill: {
    unitId: IUnitId;
  };
}

export class SwapBillsWithDustCollector {
  public static create(
    data: ISwapBillsWithDustCollectorTransactionData,
  ): OwnerProofTransactionOrder<SwapBillsWithDustCollectorAttributes> {
    return new OwnerProofTransactionOrder(
      data.version,
      new TransactionPayload<SwapBillsWithDustCollectorAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.SwapBillsWithDustCollector,
        new SwapBillsWithDustCollectorAttributes(data.proofs),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public static createTransactionRecordWithProof(
    bytes: Uint8Array,
  ): TransactionRecordWithProof<SwapBillsWithDustCollectorTransactionOrder> {
    return TransactionRecordWithProof.fromCbor(bytes, SwapBillsWithDustCollectorAttributes, OwnerProofAuthProof);
  }
}
