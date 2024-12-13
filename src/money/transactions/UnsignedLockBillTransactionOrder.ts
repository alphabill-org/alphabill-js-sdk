import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { LockBillAttributes } from '../attributes/LockBillAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';
import { LockBillTransactionOrder } from './LockBillTransactionOrder.js';

export interface ILockBillTransactionData extends ITransactionData {
  status: bigint;
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedLockBillTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<LockBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ILockBillTransactionData): UnsignedLockBillTransactionOrder {
    return new UnsignedLockBillTransactionOrder(
      data.version,
      new TransactionPayload<LockBillAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.LockBill,
        new LockBillAttributes(data.status, data.bill.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
  ): Promise<LockBillTransactionOrder> {
    const authProofBytes: Uint8Array[] = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(CborEncoder.encodeArray(authProofBytes)));
    const feeProof =
      (await feeProofFactory?.create(CborEncoder.encodeArray([...authProofBytes, ownerProof.encode()]))) ?? null;
    return new LockBillTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
