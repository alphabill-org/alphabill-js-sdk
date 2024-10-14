import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { FeeCreditTransactionType } from '../../json-rpc/FeeCreditTransactionType.js';
import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { LockFeeCreditAttributes } from '../attribute/LockFeeCreditAttributes.js';
import { ITransactionClientMetadata } from '../ITransactionClientMetadata.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofSigningService } from '../proof/IProofSigningService.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { LockFeeCreditTransactionOrder } from './types/LockFeeCreditTransactionOrder.js';

interface ILockFeeCreditTransactionData {
  status: bigint;
  feeCredit: {
    unitId: IUnitId;
    counter: bigint;
  };
  networkIdentifier: NetworkIdentifier;
  stateLock: StateLock | null;
  metadata: ITransactionClientMetadata;
  stateUnlock: IPredicate | null;
}

export class UnsignedLockFeeCreditTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<LockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: ILockFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedLockFeeCreditTransactionOrder> {
    return Promise.resolve(
      new UnsignedLockFeeCreditTransactionOrder(
        new TransactionPayload<LockFeeCreditAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.feeCredit.unitId,
          FeeCreditTransactionType.LockFeeCredit,
          new LockFeeCreditAttributes(data.status, data.feeCredit.counter),
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
  ): Promise<LockFeeCreditTransactionOrder> {
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

    return new LockFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
