import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { DeleteFeeCreditAttributes } from '../attributes/DeleteFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { DeleteFeeCreditTransactionOrder } from './DeleteFeeCreditTransactionOrder.js';

interface IDeleteFeeCreditTransactionData extends ITransactionData {
  feeCredit: { unitId: IUnitId; counter: bigint };
}

export class UnsignedDeleteFeeCreditTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<DeleteFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: IDeleteFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedDeleteFeeCreditTransactionOrder> {
    return Promise.resolve(
      new UnsignedDeleteFeeCreditTransactionOrder(
        new TransactionPayload<DeleteFeeCreditAttributes>(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.feeCredit.unitId,
          FeeCreditTransactionType.DeleteFeeCredit,
          new DeleteFeeCreditAttributes(data.feeCredit.counter),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<DeleteFeeCreditTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof = null;
    return new DeleteFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
