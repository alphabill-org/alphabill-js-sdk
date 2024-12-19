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
    public readonly version: bigint,
    public readonly payload: TransactionPayload<UnlockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: IUnlockFeeCreditTransactionData): UnsignedUnlockFeeCreditTransactionOrder {
    return new UnsignedUnlockFeeCreditTransactionOrder(
      data.version,
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

  public async sign(ownerProofFactory: IProofFactory): Promise<UnlockFeeCreditTransactionOrder> {
    const authProofBytes = [
      CborEncoder.encodeUnsignedInteger(this.version),
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(CborEncoder.encodeArray(authProofBytes)));
    const feeProof = null;
    return new UnlockFeeCreditTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
