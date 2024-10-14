import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { FeeCreditTransactionType } from '../../json-rpc/FeeCreditTransactionType.js';
import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { CloseFeeCreditAttributes } from '../attribute/CloseFeeCreditAttributes.js';
import { ITransactionClientMetadata } from '../ITransactionClientMetadata.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { CloseFeeCreditTransactionOrder } from './types/CloseFeeCreditTransactionOrder.js';

interface ICloseFeeCreditTransactionData {
  bill: { unitId: IUnitId; counter: bigint };
  feeCreditRecord: { unitId: IUnitId; balance: bigint; counter: bigint };
  networkIdentifier: NetworkIdentifier;
  stateLock: StateLock | null;
  metadata: ITransactionClientMetadata;
  stateUnlock: IPredicate | null;
}

export class UnsignedCloseFeeCreditTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<CloseFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ICloseFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedCloseFeeCreditTransactionOrder> {
    return Promise.resolve(
      new UnsignedCloseFeeCreditTransactionOrder(
        new TransactionPayload<CloseFeeCreditAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
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
        codec,
      ),
    );
  }

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<CloseFeeCreditTransactionOrder> {
    const ownerProofBytes = await this.codec.encode([await this.payload.encode(this.codec), this.stateUnlock]);
    const ownerProof = await ownerProofSigner.sign(ownerProofBytes);
    const feeProofBytes = await this.codec.encode([
      await this.payload.encode(this.codec),
      this.stateUnlock,
      ownerProof,
    ]);
    const feeProof = await feeProofSigner.sign(feeProofBytes);
    return new CloseFeeCreditTransactionOrder(
      this.payload,
      new OwnerProofAuthProof(ownerProof, ownerProofSigner.publicKey),
      new OwnerProofAuthProof(feeProof, ownerProofSigner.publicKey),
      this.stateUnlock,
    );
  }
}
