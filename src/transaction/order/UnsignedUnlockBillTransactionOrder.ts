import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { MoneyPartitionTransactionType } from '../../json-rpc/MoneyPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { UnlockBillAttributes } from '../attribute/UnlockBillAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofSigningService } from '../proof/IProofSigningService.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { UnlockBillTransactionOrder } from './types/UnlockBillTransactionOrder.js';

export interface ILockBillTransactionData extends ITransactionData {
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedUnlockBillTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<UnlockBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(data: ILockBillTransactionData, codec: ICborCodec): Promise<UnsignedUnlockBillTransactionOrder> {
    return Promise.resolve(
      new UnsignedUnlockBillTransactionOrder(
        new TransactionPayload<UnlockBillAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.bill.unitId,
          MoneyPartitionTransactionType.UnlockBill,
          new UnlockBillAttributes(data.bill.counter),
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
  ): Promise<UnlockBillTransactionOrder> {
    const ownerProof = new OwnerProofAuthProof(
      await ownerProofSigner.sign(await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock])),
    );
    const feeProof = new OwnerProofAuthProof(
      await feeProofSigner.sign(
        await this.codec.encode([
          await this.payload.encode(this.codec),
          this.stateUnlock,
          ownerProof.encode(this.codec),
        ]),
      ),
    );

    return new UnlockBillTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
