import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { ReclaimFeeCreditAttributes } from '../attributes/ReclaimFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { ReclaimFeeCreditTransactionOrder } from './ReclaimFeeCreditTransactionOrder.js';
import { CloseFeeCreditTransactionRecordWithProof } from './records/CloseFeeCreditTransactionRecordWithProof.js';

interface IReclaimFeeCreditTransactionData extends ITransactionData {
  proof: CloseFeeCreditTransactionRecordWithProof;
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedReclaimFeeCreditTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<ReclaimFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: IReclaimFeeCreditTransactionData): UnsignedReclaimFeeCreditTransactionOrder {
    return new UnsignedReclaimFeeCreditTransactionOrder(
      data.version,
      new TransactionPayload<ReclaimFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        FeeCreditTransactionType.ReclaimFeeCredit,
        new ReclaimFeeCreditAttributes(data.proof),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<ReclaimFeeCreditTransactionOrder> {
    const authProofBytes = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(CborEncoder.encodeArray(authProofBytes)));
    const feeProof = null;
    return new ReclaimFeeCreditTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
