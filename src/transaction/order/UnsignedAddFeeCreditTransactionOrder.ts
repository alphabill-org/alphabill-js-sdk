import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { FeeCreditTransactionType } from '../../json-rpc/FeeCreditTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { AddFeeCreditAttributes } from '../attribute/AddFeeCreditAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransferFeeCreditTransactionRecordWithProof } from '../record/TransferFeeCreditTransactionRecordWithProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { AddFeeCreditTransactionOrder } from './types/AddFeeCreditTransactionOrder.js';

interface IAddFeeCreditTransactionData extends ITransactionData {
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

  public static create(
    data: IAddFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedAddFeeCreditTransactionOrder> {
    return Promise.resolve(
      new UnsignedAddFeeCreditTransactionOrder(
        new TransactionPayload<AddFeeCreditAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.feeCreditRecord.unitId,
          FeeCreditTransactionType.AddFeeCredit,
          new AddFeeCreditAttributes(data.ownerPredicate, data.proof),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<AddFeeCreditTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof = null;
    return new AddFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
