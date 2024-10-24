import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { SetFeeCreditAttributes } from '../attributes/SetFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { SetFeeCreditTransactionOrder } from './SetFeeCreditTransactionOrder.js';

interface ISetFeeCreditTransactionData extends ITransactionData {
  targetSystemIdentifier: SystemIdentifier;
  ownerPredicate: IPredicate;
  amount: bigint;
  feeCreditRecord: { unitId: IUnitId; counter: bigint | null };
}

export class UnsignedSetFeeCreditTransactionOrder {
  private constructor(
    public readonly payload: TransactionPayload<SetFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ISetFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedSetFeeCreditTransactionOrder> {
    return Promise.resolve(
      new UnsignedSetFeeCreditTransactionOrder(
        new TransactionPayload<SetFeeCreditAttributes>(
          data.networkIdentifier,
          data.targetSystemIdentifier,
          data.feeCreditRecord.unitId,
          FeeCreditTransactionType.SetFeeCredit,
          new SetFeeCreditAttributes(data.ownerPredicate, data.amount, data.feeCreditRecord.counter),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<SetFeeCreditTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof = null;
    return new SetFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
