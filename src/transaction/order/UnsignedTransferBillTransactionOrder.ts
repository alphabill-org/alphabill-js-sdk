import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { MoneyPartitionTransactionType } from '../../json-rpc/MoneyPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { TransferBillAttributes } from '../attribute/TransferBillAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { TransferBillTransactionOrder } from './types/TransferBillTransactionOrder.js';

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
    public readonly payload: TransactionPayload<TransferBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ITransferBillTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedTransferBillTransactionOrder> {
    return Promise.resolve(
      new UnsignedTransferBillTransactionOrder(
        new TransactionPayload<TransferBillAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.bill.unitId,
          MoneyPartitionTransactionType.TransferBill,
          new TransferBillAttributes(data.ownerPredicate, data.bill.value, data.bill.counter),
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
  ): Promise<TransferBillTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new TransferBillTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
