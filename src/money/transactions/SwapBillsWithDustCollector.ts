import { IUnitId } from '../../IUnitId.js';
import { ClientMetadata } from '../../transaction/ClientMetadata.js';
import { ITransactionData } from '../../transaction/ITransactionData.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { TransactionOrder } from '../../transaction/TransactionOrder.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { OwnerProofUnsignedTransactionOrder } from '../../transaction/unsigned/OwnerProofUnsignedTransactionOrder.js';
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
  ): OwnerProofUnsignedTransactionOrder<SwapBillsWithDustCollectorAttributes> {
    return new OwnerProofUnsignedTransactionOrder(
      data.version,
      new TransactionPayload<SwapBillsWithDustCollectorAttributes>(
        data.networkIdentifier,
        data.partitionIdentifier,
        data.bill.unitId,
        MoneyPartitionTransactionType.SwapBillsWithDustCollector,
        new SwapBillsWithDustCollectorAttributes(data.proofs),
        data.stateLock,
        ClientMetadata.create(data.metadata),
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
