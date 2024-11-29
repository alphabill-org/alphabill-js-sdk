import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { UnlockFeeCreditAttributes } from '../attributes/UnlockFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { UnlockFeeCreditTransactionOrder } from './UnlockFeeCreditTransactionOrder.js';

interface IUnlockFeeCreditTransactionData extends ITransactionData {
  feeCredit: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedUnlockFeeCreditTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<UnlockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: IUnlockFeeCreditTransactionData): UnsignedUnlockFeeCreditTransactionOrder {
    return new UnsignedUnlockFeeCreditTransactionOrder(
      new TransactionPayload<UnlockFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.feeCredit.unitId,
        FeeCreditTransactionType.UnlockFeeCredit,
        new UnlockFeeCreditAttributes(data.feeCredit.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(ownerProofFactory: IProofFactory): UnlockFeeCreditTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(authProof));
    const feeProof = null;
    return new UnlockFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
