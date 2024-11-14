import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifiers } from '../../PartitionIdentifiers.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnlockTokenAttributes } from '../attributes/UnlockTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { UnlockTokenTransactionOrder } from './UnlockTokenTransactionOrder.js';

export interface IUnlockTokenTransactionData extends ITransactionData {
  token: { unitId: IUnitId; counter: bigint };
}

export class UnsignedUnlockTokenTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<UnlockTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(data: IUnlockTokenTransactionData, codec: ICborCodec): UnsignedUnlockTokenTransactionOrder {
    return new UnsignedUnlockTokenTransactionOrder(
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifiers.Token,
        data.token.unitId,
        TokenPartitionTransactionType.UnlockToken,
        new UnlockTokenAttributes(data.token.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
      codec,
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
