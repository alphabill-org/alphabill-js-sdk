import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { FeeCreditTransactionType } from '../../json-rpc/FeeCreditTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { CloseFeeCreditAttributes } from '../attribute/CloseFeeCreditAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { CloseFeeCreditTransactionOrder } from './types/CloseFeeCreditTransactionOrder.js';

interface ICloseFeeCreditTransactionData extends ITransactionData {
  bill: { unitId: IUnitId; counter: bigint };
  feeCreditRecord: { unitId: IUnitId; balance: bigint; counter: bigint };
}

export class UnsignedCloseFeeCreditTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<CloseFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ICloseFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedCloseFeeCreditTransactionOrder> {
    return Promise.resolve(
      new UnsignedCloseFeeCreditTransactionOrder(
        new TransactionPayload<CloseFeeCreditAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.feeCreditRecord.unitId,
          FeeCreditTransactionType.CloseFeeCredit,
          new CloseFeeCreditAttributes(
            data.feeCreditRecord.balance,
            data.bill.unitId,
            data.bill.counter,
            data.feeCreditRecord.counter,
          ),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<CloseFeeCreditTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof = null;
    return new CloseFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
