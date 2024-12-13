import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { LockFeeCreditAttributes } from '../attributes/LockFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { LockFeeCreditTransactionOrder } from './LockFeeCreditTransactionOrder.js';

interface ILockFeeCreditTransactionData extends ITransactionData {
  status: bigint;
  feeCredit: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedLockFeeCreditTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<LockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ILockFeeCreditTransactionData): UnsignedLockFeeCreditTransactionOrder {
    return new UnsignedLockFeeCreditTransactionOrder(
      data.version,
      new TransactionPayload<LockFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.feeCredit.unitId,
        FeeCreditTransactionType.LockFeeCredit,
        new LockFeeCreditAttributes(data.status, data.feeCredit.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(ownerProofFactory: IProofFactory): LockFeeCreditTransactionOrder {
    const authProofBytes = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(CborEncoder.encodeArray(authProofBytes)));
    const feeProof = null;
    return new LockFeeCreditTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
