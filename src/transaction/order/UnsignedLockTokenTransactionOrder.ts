import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { LockTokenAttributes } from '../attribute/LockTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { LockTokenTransactionOrder } from './types/LockTokenTransactionOrder.js';

export interface ILockTokenTransactionData extends ITransactionData {
  status: bigint;
  unit: { unitId: IUnitId; counter: bigint };
}

export class UnsignedLockTokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<LockTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(data: ILockTokenTransactionData, codec: ICborCodec): Promise<UnsignedLockTokenTransactionOrder> {
    return Promise.resolve(
      new UnsignedLockTokenTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.unit.unitId,
          TokenPartitionTransactionType.LockToken,
          new LockTokenAttributes(data.status, data.unit.counter),
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
  ): Promise<LockTokenTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new LockTokenTransactionOrder(
      this.payload,
      new OwnerProofAuthProof(ownerProof, ownerProofSigner.publicKey),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
