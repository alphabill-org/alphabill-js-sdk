import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { SplitBillAttributes } from '../attributes/SplitBillAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';
import { SplitBillUnit } from '../SplitBillUnit.js';
import { SplitBillTransactionOrder } from './SplitBillTransactionOrder.js';

export interface ISplitBillTransactionData extends ITransactionData {
  splits: {
    value: bigint;
    ownerPredicate: IPredicate;
  }[];
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedSplitBillTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<SplitBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ISplitBillTransactionData): UnsignedSplitBillTransactionOrder {
    return new UnsignedSplitBillTransactionOrder(
      new TransactionPayload<SplitBillAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.SplitBill,
        new SplitBillAttributes(
          data.splits.map(({ value, ownerPredicate }) => new SplitBillUnit(value, ownerPredicate)),
          data.bill.counter,
        ),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(ownerProofFactory: IProofFactory, feeProofFactory: IProofFactory | null): SplitBillTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(authProof));
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([authProof, ownerProof.encode()])) ?? null;
    return new SplitBillTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
