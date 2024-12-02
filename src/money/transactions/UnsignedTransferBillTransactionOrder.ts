import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { PartitionIdentifier } from '../../PartitionIdentifier.js';
import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { TransferBillAttributes } from '../attributes/TransferBillAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';
import { TransferBillTransactionOrder } from './TransferBillTransactionOrder.js';

export interface ITransferBillTransactionData extends ITransactionData {
  ownerPredicate: IPredicate;
  bill: {
    unitId: IUnitId;
    counter: bigint;
    value: bigint;
  };
}

export class UnsignedTransferBillTransactionOrder {
  public constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<TransferBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  public static create(data: ITransferBillTransactionData): UnsignedTransferBillTransactionOrder {
    return new UnsignedTransferBillTransactionOrder(
      data.version,
      new TransactionPayload<TransferBillAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.TransferBill,
        new TransferBillAttributes(data.ownerPredicate, data.bill.value, data.bill.counter),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
    );
  }

  public sign(ownerProofFactory: IProofFactory, feeProofFactory: IProofFactory | null): TransferBillTransactionOrder {
    const authProof = CborEncoder.encodeArray([
      ...this.payload.encode(),
      this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
    ]);
    const ownerProof = new OwnerProofAuthProof(ownerProofFactory.create(authProof));
    const feeProof = feeProofFactory?.create(CborEncoder.encodeArray([authProof, ownerProof.encode()])) ?? null;
    return new TransferBillTransactionOrder(this.version, this.payload, this.stateUnlock, ownerProof, feeProof);
  }
}
