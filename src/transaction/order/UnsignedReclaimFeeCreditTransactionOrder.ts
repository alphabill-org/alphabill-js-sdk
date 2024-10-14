import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { FeeCreditTransactionType } from '../../json-rpc/FeeCreditTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { ReclaimFeeCreditAttributes } from '../attribute/ReclaimFeeCreditAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofSigningService } from '../proof/IProofSigningService.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { CloseFeeCreditTransactionRecordWithProof } from '../record/CloseFeeCreditTransactionRecordWithProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { ReclaimFeeCreditTransactionOrder } from './types/ReclaimFeeCreditTransactionOrder.js';

interface IReclaimFeeCreditTransactionData extends ITransactionData {
  proof: CloseFeeCreditTransactionRecordWithProof;
  bill: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedReclaimFeeCreditTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<ReclaimFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: IReclaimFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedReclaimFeeCreditTransactionOrder> {
    return Promise.resolve(
      new UnsignedReclaimFeeCreditTransactionOrder(
        new TransactionPayload<ReclaimFeeCreditAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.bill.unitId,
          FeeCreditTransactionType.LockFeeCredit,
          new ReclaimFeeCreditAttributes(data.proof),
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
  ): Promise<ReclaimFeeCreditTransactionOrder> {
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

    return new ReclaimFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
