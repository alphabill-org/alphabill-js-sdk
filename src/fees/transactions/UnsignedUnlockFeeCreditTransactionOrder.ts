import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnlockFeeCreditAttributes } from '../attributes/UnlockFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { UnlockFeeCreditTransactionOrder } from './UnlockFeeCreditTransactionOrder.js';

interface IUnlockFeeCreditTransactionData extends ITransactionData {
  feeCredit: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedUnlockFeeCreditTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<UnlockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: IUnlockFeeCreditTransactionData,
    codec: ICborCodec,
  ): UnsignedUnlockFeeCreditTransactionOrder {
    return new UnsignedUnlockFeeCreditTransactionOrder(
      new TransactionPayload<UnlockFeeCreditAttributes>(
        data.networkIdentifier,
        SystemIdentifier.MONEY_PARTITION,
        data.feeCredit.unitId,
        FeeCreditTransactionType.UnlockFeeCredit,
        new UnlockFeeCreditAttributes(data.feeCredit.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
      codec,
    );
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<UnlockFeeCreditTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof = null;
    return new UnlockFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
