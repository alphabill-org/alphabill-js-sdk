import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { IUnitId } from '../../IUnitId.js';
import { FeeCreditTransactionType } from '../../json-rpc/FeeCreditTransactionType.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { UnlockFeeCreditAttributes } from '../attribute/UnlockFeeCreditAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { IProofSigningService } from '../proof/IProofSigningService.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ITransactionData } from './ITransactionData.js';
import { UnlockFeeCreditTransactionOrder } from './types/UnlockFeeCreditTransactionOrder.js';

interface IUnlockFeeCreditTransactionData extends ITransactionData {
  feeCredit: {
    unitId: IUnitId;
    counter: bigint;
  };
}

export class UnsignedUnlockFeeCreditTransactionOrder {
  public constructor(
    public readonly payload: TransactionPayload<UnlockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public static create(
    data: IUnlockFeeCreditTransactionData,
    codec: ICborCodec,
  ): Promise<UnsignedUnlockFeeCreditTransactionOrder> {
    return Promise.resolve(
      new UnsignedUnlockFeeCreditTransactionOrder(
        new TransactionPayload<UnlockFeeCreditAttributes>(
          data.networkIdentifier,
          SystemIdentifier.MONEY_PARTITION,
          data.feeCredit.unitId,
          FeeCreditTransactionType.UnlockFeeCredit,
          new UnlockFeeCreditAttributes(data.feeCredit.counter),
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
  ): Promise<UnlockFeeCreditTransactionOrder> {
    const authProof = [await this.payload.encode(this.codec), this.stateUnlock];
    const ownerProof = new OwnerProofAuthProof(await ownerProofSigner.sign(await this.codec.encode(authProof)));
    const feeProof = await feeProofSigner.sign(await this.codec.encode([...authProof, ownerProof.encode()]));
    return new UnlockFeeCreditTransactionOrder(this.payload, ownerProof, feeProof, this.stateUnlock);
  }
}
