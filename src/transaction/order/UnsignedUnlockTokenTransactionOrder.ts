import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { UnlockTokenAttributes } from '../attribute/UnlockTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { UnlockTokenTransactionOrder } from './types/UnlockTokenTransactionOrder.js';

export interface IUnlockTokenTransactionData extends ITransactionData {
  unit: { unitId: IUnitId; counter: bigint };
}

export class UnsignedUnlockTokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<UnlockTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: IUnlockTokenTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedUnlockTokenTransactionOrder> {
    return Promise.resolve(
      new UnsignedUnlockTokenTransactionOrder(
        new TransactionPayload(
          data.networkIdentifier,
          SystemIdentifier.TOKEN_PARTITION,
          data.unit.unitId,
          TokenPartitionTransactionType.LockToken,
          new UnlockTokenAttributes(data.unit.counter),
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
  ): Promise<UnlockTokenTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new UnlockTokenTransactionOrder(
      this.payload,
      new OwnerProofAuthProof(ownerProof, ownerProofSigner.publicKey),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
