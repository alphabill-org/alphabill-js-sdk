import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { MoneyPartitionTransactionType } from '../../json-rpc/MoneyPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { SplitBillAttributes } from '../attribute/SplitBillAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofSigningService } from '../proof/IProofSigningService.js';
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
    ownerProofSigner: IProofSigningService,
    feeProofSigner: IProofSigningService,
  ): Promise<SplitBillTransactionOrder> {
    const authProof = [await this.payload.encode(this.codec), this.stateUnlock];
    const ownerProof = new OwnerProofAuthProof(await ownerProofSigner.sign(await this.codec.encode(authProof)));
    const feeProof = await feeProofSigner.sign(await this.codec.encode([...authProof, ownerProof.encode()]));
    return new SplitBillTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
