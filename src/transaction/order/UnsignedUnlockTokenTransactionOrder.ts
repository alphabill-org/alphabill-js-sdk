import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { UnlockTokenAttributes } from '../attribute/UnlockTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { UnlockTokenTransactionOrder } from './types/UnlockTokenTransactionOrder.js';

export class UnsignedUnlockTokenTransactionOrder implements IUnsignedTransactionOrder<UnlockTokenTransactionOrder> {
  public constructor(
    public readonly payload: TransactionPayload<UnlockTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<UnlockTokenTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new UnlockTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
