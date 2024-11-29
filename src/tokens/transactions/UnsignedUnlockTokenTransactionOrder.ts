import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
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
  ) {}

  public static create(data: IUnlockTokenTransactionData): UnsignedUnlockTokenTransactionOrder {
    return new UnsignedUnlockTokenTransactionOrder(
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.UnlockToken,
        new UnlockTokenAttributes(data.token.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(ownerProofFactory: IProofFactory, feeProofFactory: IProofFactory | null): UnlockTokenTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(authProof));
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([authProof, ownerProof.encode()])) ?? null;
    return new UnlockTokenTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
