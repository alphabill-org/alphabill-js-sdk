import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { DeleteFeeCreditAttributes } from '../attributes/DeleteFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { DeleteFeeCreditTransactionOrder } from './DeleteFeeCreditTransactionOrder.js';

interface IDeleteFeeCreditTransactionData extends ITransactionData {
  feeCredit: { unitId: IUnitId; counter: bigint };
}

export class UnsignedDeleteFeeCreditTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<DeleteFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: IDeleteFeeCreditTransactionData): UnsignedDeleteFeeCreditTransactionOrder {
    return new UnsignedDeleteFeeCreditTransactionOrder(
      data.version,
      new TransactionPayload<DeleteFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.TOKEN,
        data.feeCredit.unitId,
        FeeCreditTransactionType.DeleteFeeCredit,
        new DeleteFeeCreditAttributes(data.feeCredit.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(ownerProofFactory: IProofFactory): DeleteFeeCreditTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(authProof));
    const feeProof = null;
    return new DeleteFeeCreditTransactionOrder(this.version, this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
