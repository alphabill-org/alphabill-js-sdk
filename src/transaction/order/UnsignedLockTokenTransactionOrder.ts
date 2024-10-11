import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { LockTokenAttributes } from '../attribute/LockTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { LockTokenTransactionOrder } from './types/LockTokenTransactionOrder.js';

export class UnsignedLockTokenTransactionOrder implements IUnsignedTransactionOrder<LockTokenTransactionOrder> {
  public constructor(
    public readonly payload: TransactionPayload<LockTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<LockTokenTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new LockTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
