import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
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
    public readonly payload: TransactionPayload<ReclaimFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: IReclaimFeeCreditTransactionData,
    codec: ICborCodec,
  ): UnsignedReclaimFeeCreditTransactionOrder {
    return new UnsignedReclaimFeeCreditTransactionOrder(
      new TransactionPayload<ReclaimFeeCreditAttributes>(
        data.networkIdentifier,
        SystemIdentifier.MONEY_PARTITION,
        data.bill.unitId,
        FeeCreditTransactionType.ReclaimFeeCredit,
        new ReclaimFeeCreditAttributes(data.proof),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
      codec,
    );
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<ReclaimFeeCreditTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof = null;
    return new ReclaimFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
