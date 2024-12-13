import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnlockBillAttributes } from '../attributes/UnlockBillAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';
import { UnlockBillTransactionOrder } from './UnlockBillTransactionOrder.js';

export interface ILockBillTransactionData extends ITransactionData {
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedUnlockBillTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<UnlockBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ILockBillTransactionData): UnsignedUnlockBillTransactionOrder {
    return new UnsignedUnlockBillTransactionOrder(
      data.version,
      new TransactionPayload<UnlockBillAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.UnlockBill,
        new UnlockBillAttributes(data.bill.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
  ): Promise<UnlockBillTransactionOrder> {
    const authProofBytes: Uint8Array[] = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(CborEncoder.encodeArray(authProofBytes)));
    const feeProof =
      (await feeProofFactory?.create(CborEncoder.encodeArray([...authProofBytes, ownerProof.encode()]))) ?? null;
    return new UnlockBillTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
