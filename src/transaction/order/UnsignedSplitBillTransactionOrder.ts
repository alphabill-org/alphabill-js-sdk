import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { MoneyPartitionTransactionType } from '../../json-rpc/MoneyPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { SplitBillAttributes } from '../attribute/SplitBillAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { SplitBillUnit } from '../SplitBillUnit.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { SplitBillTransactionOrder } from './types/SplitBillTransactionOrder.js';

export interface ISplitBillTransactionData extends ITransactionData {
  splits: {
    value: bigint;
    ownerPredicate: IPredicate;
  }[];
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedSplitBillTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<SplitBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(data: ISplitBillTransactionData, codec: ICborCodec): Promise<UnsignedSplitBillTransactionOrder> {
    return Promise.resolve(
      new UnsignedSplitBillTransactionOrder(
        new TransactionPayload<SplitBillAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.bill.unitId,
          MoneyPartitionTransactionType.SplitBill,
          new SplitBillAttributes(
            data.splits.map(({ value, ownerPredicate }) => new SplitBillUnit(value, ownerPredicate)),
            data.bill.counter,
          ),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
  ): Promise<SplitBillTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new SplitBillTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
