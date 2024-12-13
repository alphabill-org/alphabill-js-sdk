import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnitIdWithType } from '../../transaction/UnitIdWithType.js';
import { UnitId } from '../../UnitId.js';
import { TransferFeeCreditAttributes } from '../attributes/TransferFeeCreditAttributes.js';
import { FeeCreditUnitType } from '../FeeCreditRecordUnitType.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { TransferFeeCreditTransactionOrder } from './TransferFeeCreditTransactionOrder.js';

interface ITransferFeeCreditTransactionData extends ITransactionData {
  amount: bigint;
  targetPartitionIdentifier: number;
  latestAdditionTime: bigint;
  feeCreditRecord: {
    ownerPredicate: IPredicate;
    unitId?: IUnitId;
    counter?: bigint;
  };
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedTransferFeeCreditTransactionOrder {
  private constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<TransferFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ITransferFeeCreditTransactionData): UnsignedTransferFeeCreditTransactionOrder {
    let feeCreditRecordId = data.feeCreditRecord.unitId;
    if (feeCreditRecordId == null) {
      feeCreditRecordId = this.createUnitId(data.feeCreditRecord.ownerPredicate, data.latestAdditionTime);
    }
    return new UnsignedTransferFeeCreditTransactionOrder(
      data.version,
      new TransactionPayload<TransferFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        FeeCreditTransactionType.TransferFeeCredit,
        new TransferFeeCreditAttributes(
          data.amount,
          data.targetPartitionIdentifier,
          feeCreditRecordId,
          data.latestAdditionTime,
          data.feeCreditRecord?.counter ?? 0n,
          data.bill.counter,
        ),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  private static createUnitId(ownerPredicate: IPredicate, latestAdditionTime: bigint): UnitId {
    const unitBytes = sha256
      .create()
      .update(CborEncoder.encodeByteString(ownerPredicate.bytes))
      .update(CborEncoder.encodeUnsignedInteger(latestAdditionTime))
      .digest();
    return new UnitIdWithType(unitBytes, FeeCreditUnitType.FEE_CREDIT_RECORD);
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<TransferFeeCreditTransactionOrder> {
    const authProofBytes = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(CborEncoder.encodeArray(authProofBytes)));
    const feeProof = null;
    return new TransferFeeCreditTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
