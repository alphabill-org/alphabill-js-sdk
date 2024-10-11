import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { UnlockBillAttributes } from '../attribute/UnlockBillAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { UnlockBillTransactionOrder } from './UnlockBillTransactionOrder.js';

export class UnsignedUnlockBillTransactionOrder implements IUnsignedTransactionOrder<UnlockBillTransactionOrder> {
  public constructor(
    public readonly payload: TransactionPayload<UnlockBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<UnlockBillTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new UnlockBillTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
