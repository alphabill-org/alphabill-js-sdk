import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { MoneyPartitionTransactionType } from '../../json-rpc/MoneyPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { LockBillAttributes } from '../attribute/LockBillAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofSigningService } from '../proof/IProofSigningService.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { LockBillTransactionOrder } from './types/LockBillTransactionOrder.js';

export interface ILockBillTransactionData extends ITransactionData {
  status: bigint;
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedLockBillTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<LockBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(data: ILockBillTransactionData, codec: ICborCodec): Promise<UnsignedLockBillTransactionOrder> {
    return Promise.resolve(
      new UnsignedLockBillTransactionOrder(
        new TransactionPayload<LockBillAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.bill.unitId,
          MoneyPartitionTransactionType.LockBill,
          new LockBillAttributes(data.status, data.bill.counter),
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
  ): Promise<LockBillTransactionOrder> {
    const authProof = [await this.payload.encode(this.codec), this.stateUnlock];
    const ownerProof = new OwnerProofAuthProof(await ownerProofSigner.sign(await this.codec.encode(authProof)));
    const feeProof = await feeProofSigner.sign(await this.codec.encode([...authProof, ownerProof.encode()]));
    return new LockBillTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
