import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { MoneyPartitionTransactionType } from '../../json-rpc/MoneyPartitionTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { TransferBillToDustCollectorAttributes } from '../attribute/TransferBillToDustCollectorAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofFactory } from '../proof/IProofFactory.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { TransferBillToDustCollectorTransactionOrder } from './types/TransferBillToDustCollectorTransactionOrder.js';

export interface ISwapBillsWithDustCollectorTransactionData extends ITransactionData {
  bill: {
    unitId: IUnitId;
    counter: bigint;
    value: bigint;
  };
  targetBill: {
    unitId: IUnitId;
    counter: bigint;
    value: bigint;
  };
}

export class UnsignedTransferBillToDustCollectorTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<TransferBillToDustCollectorAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ISwapBillsWithDustCollectorTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedTransferBillToDustCollectorTransactionOrder> {
    return Promise.resolve(
      new UnsignedTransferBillToDustCollectorTransactionOrder(
        new TransactionPayload<TransferBillToDustCollectorAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.bill.unitId,
          MoneyPartitionTransactionType.TransferBillToDustCollector,
          new TransferBillToDustCollectorAttributes(
            data.bill.value,
            data.targetBill.unitId,
            data.targetBill.counter,
            data.bill.counter,
          ),
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
  ): Promise<TransferBillToDustCollectorTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new TransferBillToDustCollectorTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
