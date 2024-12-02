import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { AddFeeCreditAttributes } from '../attributes/AddFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { AddFeeCreditTransactionOrder } from './AddFeeCreditTransactionOrder.js';
import { TransferFeeCreditTransactionRecordWithProof } from './records/TransferFeeCreditTransactionRecordWithProof.js';

interface IAddFeeCreditTransactionData extends ITransactionData {
  targetPartitionIdentifier: number;
  ownerPredicate: IPredicate;
  proof: TransferFeeCreditTransactionRecordWithProof;
  feeCreditRecord: { unitId: IUnitId };
}

export class UnsignedAddFeeCreditTransactionOrder {
  private constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<AddFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: IAddFeeCreditTransactionData): UnsignedAddFeeCreditTransactionOrder {
    return new UnsignedAddFeeCreditTransactionOrder(
      data.version,
      new TransactionPayload<AddFeeCreditAttributes>(
        data.networkIdentifier,
        data.targetPartitionIdentifier,
        data.feeCreditRecord.unitId,
        FeeCreditTransactionType.AddFeeCredit,
        new AddFeeCreditAttributes(data.ownerPredicate, data.proof),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(ownerProofFactory: IProofFactory): AddFeeCreditTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(authProof));
    const feeProof = null;
    return new AddFeeCreditTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
