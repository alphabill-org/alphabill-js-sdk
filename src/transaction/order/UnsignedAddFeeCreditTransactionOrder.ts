import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { FeeCreditTransactionType } from '../../json-rpc/FeeCreditTransactionType.js';
import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { AddFeeCreditAttributes } from '../attribute/AddFeeCreditAttributes.js';
import { ITransactionClientMetadata } from '../ITransactionClientMetadata.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransferFeeCreditTransactionRecordWithProof } from '../record/TransferFeeCreditTransactionRecordWithProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { AddFeeCreditTransactionOrder } from './types/AddFeeCreditTransactionOrder.js';

interface IAddFeeCreditTransactionData {
  ownerPredicate: IPredicate;
  proof: TransferFeeCreditTransactionRecordWithProof;
  feeCreditRecord: { unitId: IUnitId };
  networkIdentifier: NetworkIdentifier;
  stateLock: StateLock | null;
  metadata: ITransactionClientMetadata;
  stateUnlock: IPredicate | null;
}

export class UnsignedAddFeeCreditTransactionOrder {
  private constructor(
    public readonly payload: TransactionPayload<AddFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: IAddFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedAddFeeCreditTransactionOrder> {
    return Promise.resolve(
      new UnsignedAddFeeCreditTransactionOrder(
        new TransactionPayload<AddFeeCreditAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.feeCreditRecord.unitId,
          FeeCreditTransactionType.AddFeeCredit,
          new AddFeeCreditAttributes(data.ownerPredicate, data.proof),
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
  ): Promise<AddFeeCreditTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new AddFeeCreditTransactionOrder(
      this.payload,
      new OwnerProofAuthProof(ownerProof, ownerProofSigner.publicKey),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
