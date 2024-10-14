import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { MoneyPartitionTransactionType } from '../../json-rpc/MoneyPartitionTransactionType.js';
import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { TransferBillAttributes } from '../attribute/TransferBillAttributes.js';
import { ITransactionClientMetadata } from '../ITransactionClientMetadata.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofSigningService } from '../proof/IProofSigningService.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { TransferBillTransactionOrder } from './types/TransferBillTransactionOrder.js';

export interface ITransferBillTransactionData {
  ownerPredicate: IPredicate;
  bill: {
    unitId: IUnitId;
    counter: bigint;
    value: bigint;
  };
  networkIdentifier: NetworkIdentifier;
  stateLock: StateLock | null;
  metadata: ITransactionClientMetadata;
  stateUnlock: IPredicate | null;
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
    ownerProofSigner: IProofSigningService,
    feeProofSigner: IProofSigningService,
  ): Promise<TransferBillTransactionOrder> {
    const ownerProof = new OwnerProofAuthProof(
      await ownerProofSigner.sign(await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock])),
    );
    const feeProof = new OwnerProofAuthProof(
      await feeProofSigner.sign(
        await this.codec.encode([
          await this.payload.encode(this.codec),
          this.stateUnlock,
          ownerProof.encode(this.codec),
        ]),
      ),
    );

    return new TransferBillTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
