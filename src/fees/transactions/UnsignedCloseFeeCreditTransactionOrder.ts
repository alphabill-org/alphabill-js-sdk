import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { CloseFeeCreditAttributes } from '../attributes/CloseFeeCreditAttributes.js';
import { FeeCreditTransactionType } from '../FeeCreditTransactionType.js';
import { CloseFeeCreditTransactionOrder } from './CloseFeeCreditTransactionOrder.js';

interface ICloseFeeCreditTransactionData extends ITransactionData {
  bill: { unitId: IUnitId; counter: bigint };
  feeCreditRecord: { unitId: IUnitId; balance: bigint; counter: bigint };
}

export class UnsignedCloseFeeCreditTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<CloseFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ICloseFeeCreditTransactionData): UnsignedCloseFeeCreditTransactionOrder {
    return new UnsignedCloseFeeCreditTransactionOrder(
      data.version,
      new TransactionPayload<CloseFeeCreditAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.feeCreditRecord.unitId,
        FeeCreditTransactionType.CloseFeeCredit,
        new CloseFeeCreditAttributes(
          data.feeCreditRecord.balance,
          data.bill.unitId,
          data.bill.counter,
          data.feeCreditRecord.counter,
        ),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(ownerProofFactory: IProofFactory): CloseFeeCreditTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(authProof));
    const feeProof = null;
    return new CloseFeeCreditTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
