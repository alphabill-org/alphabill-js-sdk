import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { SwapBillsWithDustCollectorAttributes } from '../attributes/SwapBillsWithDustCollectorAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';
import { TransferBillToDustCollectorTransactionRecordWithProof } from './records/TransferBillToDustCollectorTransactionRecordWithProof.js';
import { SwapBillsWithDustCollectorTransactionOrder } from './SwapBillsWithDustCollectorTransactionOrder.js';

export interface ISwapBillsWithDustCollectorTransactionData extends ITransactionData {
  proofs: TransferBillToDustCollectorTransactionRecordWithProof[];
  bill: {
    unitId: IUnitId;
  };
}

export class UnsignedSwapBillsWithDustCollectorTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<SwapBillsWithDustCollectorAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(
    data: ISwapBillsWithDustCollectorTransactionData,
  ): UnsignedSwapBillsWithDustCollectorTransactionOrder {
    return new UnsignedSwapBillsWithDustCollectorTransactionOrder(
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

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
  ): Promise<SwapBillsWithDustCollectorTransactionOrder> {
    const authProofBytes: Uint8Array[] = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(CborEncoder.encodeArray(authProofBytes)));
    const feeProof =
      (await feeProofFactory?.create(CborEncoder.encodeArray([...authProofBytes, ownerProof.encode()]))) ?? null;
    return new SwapBillsWithDustCollectorTransactionOrder(
      this.version,
      this.payload,
      this.stateUnlock,
      ownerProof,
      feeProof,
    );
  }
}
