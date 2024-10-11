import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { UnlockFeeCreditAttributes } from '../attribute/UnlockFeeCreditAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { UnlockFeeCreditTransactionOrder } from './UnlockFeeCreditTransactionOrder.js';

export class UnsignedUnlockFeeCreditTransactionOrder implements IUnsignedTransactionOrder<UnlockFeeCreditTransactionOrder> {
  public constructor(
    public readonly payload: TransactionPayload<UnlockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<UnlockFeeCreditTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new UnlockFeeCreditTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
