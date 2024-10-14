import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { MoneyPartitionTransactionType } from '../../json-rpc/MoneyPartitionTransactionType.js';
import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { SwapBillsWithDustCollectorAttributes } from '../attribute/SwapBillsWithDustCollectorAttributes.js';
import { ITransactionClientMetadata } from '../ITransactionClientMetadata.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransferBillToDustCollectorTransactionRecordWithProof } from '../record/TransferBillToDustCollectorTransactionRecordWithProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { SwapBillsWithDustCollectorTransactionOrder } from './types/SwapBillsWithDustCollectorTransactionOrder.js';

export interface ISwapBillsWithDustCollectorTransactionData {
  ownerPredicate: IPredicate;
  proofs: TransferBillToDustCollectorTransactionRecordWithProof[];
  bill: {
    unitId: IUnitId;
  };
  networkIdentifier: NetworkIdentifier;
  stateLock: StateLock | null;
  metadata: ITransactionClientMetadata;
  stateUnlock: IPredicate | null;
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
  ): Promise<UnsignedSwapBillsWithDustCollectorTransactionOrder> {
    return Promise.resolve(
      new UnsignedSwapBillsWithDustCollectorTransactionOrder(
        new TransactionPayload<SwapBillsWithDustCollectorAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.bill.unitId,
          MoneyPartitionTransactionType.LockBill,
          new SwapBillsWithDustCollectorAttributes(data.proofs),
          data.stateLock,
          data.metadata,
        ),
        data.stateUnlock,
        codec,
      ),
    );
  }

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<SwapBillsWithDustCollectorTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new SwapBillsWithDustCollectorTransactionOrder(
      this.payload,
      new OwnerProofAuthProof(ownerProof, ownerProofSigner.publicKey),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
