import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { MoneyPartitionTransactionType } from '../../json-rpc/MoneyPartitionTransactionType.js';
import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { LockBillAttributes } from '../attribute/LockBillAttributes.js';
import { ITransactionClientMetadata } from '../ITransactionClientMetadata.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { LockBillTransactionOrder } from './types/LockBillTransactionOrder.js';

export interface ILockBillTransactionData {
  status: bigint;
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
  networkIdentifier: NetworkIdentifier;
  stateLock: StateLock | null;
  metadata: ITransactionClientMetadata;
  stateUnlock: IPredicate | null;
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
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<LockBillTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new LockBillTransactionOrder(
      this.payload,
      new OwnerProofAuthProof(ownerProof, ownerProofSigner.publicKey),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
