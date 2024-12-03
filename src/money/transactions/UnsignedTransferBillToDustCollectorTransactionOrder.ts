import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TransferBillToDustCollectorAttributes } from '../attributes/TransferBillToDustCollectorAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';
import { TransferBillToDustCollectorTransactionOrder } from './TransferBillToDustCollectorTransactionOrder.js';

export interface ISwapBillsWithDustCollectorTransactionData extends ITransactionData {
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

export class UnsignedTransferBillToDustCollectorTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<TransferBillToDustCollectorAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(
    data: ISwapBillsWithDustCollectorTransactionData,
  ): UnsignedTransferBillToDustCollectorTransactionOrder {
    return new UnsignedTransferBillToDustCollectorTransactionOrder(
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

  public sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
  ): TransferBillToDustCollectorTransactionOrder {
    const authProofBytes: Uint8Array[] = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(CborEncoder.encodeArray(authProofBytes)));
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([...authProofBytes, ownerProof.encode()])) ?? null;
    return new TransferBillToDustCollectorTransactionOrder(
      this.version,
      this.payload,
      this.stateUnlock,
      ownerProof,
      feeProof,
    );
  }
}
