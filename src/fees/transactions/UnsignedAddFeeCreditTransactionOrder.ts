import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
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
  targetSystemIdentifier: SystemIdentifier;
  ownerPredicate: IPredicate;
  proof: TransferFeeCreditTransactionRecordWithProof;
  feeCreditRecord: { unitId: IUnitId };
}

export class UnsignedAddFeeCreditTransactionOrder {
  private constructor(
    public readonly payload: TransactionPayload<AddFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(data: IAddFeeCreditTransactionData, codec: ICborCodec): UnsignedAddFeeCreditTransactionOrder {
    return new UnsignedAddFeeCreditTransactionOrder(
      new TransactionPayload<AddFeeCreditAttributes>(
        data.networkIdentifier,
        data.targetSystemIdentifier,
        data.feeCreditRecord.unitId,
        FeeCreditTransactionType.AddFeeCredit,
        new AddFeeCreditAttributes(data.ownerPredicate, data.proof),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
      codec,
    );
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<AddFeeCreditTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof = null;
    return new AddFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
