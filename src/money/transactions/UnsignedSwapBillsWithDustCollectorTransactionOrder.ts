import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';

import { ITransactionData } from '../../transaction/order/ITransactionData.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { IProofFactory } from '../../transaction/proofs/IProofFactory.js';
import { OwnerProofAuthProof } from '../../transaction/proofs/OwnerProofAuthProof.js';
import { TransactionPayload } from '../../transaction/TransactionPayload.js';
import { SwapBillsWithDustCollectorAttributes } from '../attributes/SwapBillsWithDustCollectorAttributes.js';
import { MoneyPartitionTransactionType } from '../MoneyPartitionTransactionType.js';
import { SwapBillsWithDustCollectorTransactionOrder } from './SwapBillsWithDustCollectorTransactionOrder.js';
import { TransferBillToDustCollectorTransactionRecordWithProof } from './TransferBillToDustCollectorTransactionRecordWithProof.js';
import { PartitionIdentifier } from '../../PartitionIdentifier';

export interface ISwapBillsWithDustCollectorTransactionData extends ITransactionData {
  proofs: TransferBillToDustCollectorTransactionRecordWithProof[];
  bill: {
    unitId: IUnitId;
  };
}

export class UnsignedSwapBillsWithDustCollectorTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<SwapBillsWithDustCollectorAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ISwapBillsWithDustCollectorTransactionData,
    codec: ICborCodec,
  ): UnsignedSwapBillsWithDustCollectorTransactionOrder {
    return new UnsignedSwapBillsWithDustCollectorTransactionOrder(
      new TransactionPayload<SwapBillsWithDustCollectorAttributes>(
        data.networkIdentifier,
        PartitionIdentifier.MONEY,
        data.bill.unitId,
        MoneyPartitionTransactionType.SwapBillsWithDustCollector,
        new SwapBillsWithDustCollectorAttributes(data.proofs),
        data.stateLock,
        data.metadata,
      ),
      data.stateUnlock,
      codec,
    );
  }

  public async sign(
    ownerProofFactory: IProofFactory,
    feeProofFactory: IProofFactory | null,
  ): Promise<SwapBillsWithDustCollectorTransactionOrder> {
    const authProof = [...(await this.payload.encode(this.codec)), this.stateUnlock?.bytes ?? null];
    const ownerProof = new OwnerProofAuthProof(await ownerProofFactory.create(await this.codec.encode(authProof)));
    const feeProof =
      (await feeProofFactory?.create(await this.codec.encode([...authProof, ownerProof.encode()]))) ?? null;
    return new SwapBillsWithDustCollectorTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
