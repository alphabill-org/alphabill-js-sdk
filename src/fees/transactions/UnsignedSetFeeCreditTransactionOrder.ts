import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitIdWithType } from '../../transaction/UnitIdWithType.js';
import { SetFeeCreditAttributes } from '../attributes/SetFeeCreditAttributes.js';
import { FeeCreditUnitType } from '../FeeCreditRecordUnitType.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { SetFeeCreditTransactionOrder } from './SetFeeCreditTransactionOrder.js';

interface ISetFeeCreditTransactionData extends ITransactionData {
  targetPartitionIdentifier: number;
  ownerPredicate: IPredicate;
  amount: bigint;
  feeCreditRecord: { unitId: IUnitId | null; counter: bigint | null };
}

export class UnsignedSetFeeCreditTransactionOrder {
  private constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<SetFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ISetFeeCreditTransactionData): UnsignedSetFeeCreditTransactionOrder {
    let feeCreditRecordId: IUnitId;
    if (data.feeCreditRecord.unitId == null) {
      const unitBytes = sha256
        .create()
        .update(CborEncoder.encodeByteString(data.ownerPredicate.bytes))
        .update(CborEncoder.encodeUnsignedInteger(data.metadata.timeout))
        .digest();
      feeCreditRecordId = new UnitIdWithType(unitBytes, FeeCreditUnitType.FEE_CREDIT_RECORD);
    } else {
      feeCreditRecordId = data.feeCreditRecord.unitId;
    }
    return new UnsignedSetFeeCreditTransactionOrder(
      data.version,
      new TransactionPayload<SetFeeCreditAttributes>(
        data.networkIdentifier,
        data.targetPartitionIdentifier,
        feeCreditRecordId,
        FeeCreditTransactionType.SetFeeCredit,
        new SetFeeCreditAttributes(data.ownerPredicate, data.amount, data.feeCreditRecord.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(ownerProofFactory: IProofFactory): SetFeeCreditTransactionOrder {
    const authProofBytes = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(CborEncoder.encodeArray(authProofBytes)));
    const feeProof = null;
    return new SetFeeCreditTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
