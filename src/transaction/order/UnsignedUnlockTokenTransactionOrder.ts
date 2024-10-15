import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { TokenPartitionTransactionType } from '../../json-rpc/TokenPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { UnlockTokenAttributes } from '../attribute/UnlockTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { UnlockTokenTransactionOrder } from './types/UnlockTokenTransactionOrder.js';

export interface IUnlockTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
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
          data.token.unitId,
          TokenPartitionTransactionType.LockToken,
          new UnlockTokenAttributes(data.token.counter),
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
  ): Promise<UnlockTokenTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new UnlockTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
