import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';

import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { LockFeeCreditAttributes } from '../attributes/LockFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { LockFeeCreditTransactionOrder } from './LockFeeCreditTransactionOrder.js';

interface ILockFeeCreditTransactionData extends ITransactionData {
  status: bigint;
  feeCredit: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedLockFeeCreditTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<LockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(data: ILockFeeCreditTransactionData, codec: ICborCodec): UnsignedLockFeeCreditTransactionOrder {
    return new UnsignedLockFeeCreditTransactionOrder(
      new TransactionPayload<LockFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifiers.Money,
        data.feeCredit.unitId,
        FeeCreditTransactionType.LockFeeCredit,
        new LockFeeCreditAttributes(data.status, data.feeCredit.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
      codec,
    );
  }

  public async sign(ownerProofFactory: IProofFactory): Promise<LockFeeCreditTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof = null;
    return new LockFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
