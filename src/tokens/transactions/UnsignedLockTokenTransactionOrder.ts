import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { LockTokenAttributes } from '../attributes/LockTokenAttributes.js';
import { TokenPartitionTransactionType } from '../TokenPartitionTransactionType.js';
import { LockTokenTransactionOrder } from './LockTokenTransactionOrder.js';

export interface ILockTokenTransactionData extends ITransactionData {
  status: bigint;
  token: { unitId: IUnitId; counter: bigint };
}

export class UnsignedLockTokenTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<LockTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ILockTokenTransactionData): UnsignedLockTokenTransactionOrder {
    return new UnsignedLockTokenTransactionOrder(
      data.version,
      new TransactionPayload(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.token.unitId,
        TokenPartitionTransactionType.LockToken,
        new LockTokenAttributes(data.status, data.token.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(ownerProofFactory: IProofFactory, feeProofFactory: IProofFactory | null): LockTokenTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(authProof));
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([authProof, ownerProof.encode()])) ?? null;
    return new LockTokenTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
