import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { LockFeeCreditAttributes } from '../attribute/LockFeeCreditAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { LockFeeCreditTransactionOrder } from './types/LockFeeCreditTransactionOrder.js';

export class UnsignedLockFeeCreditTransactionOrder implements IUnsignedTransactionOrder<LockFeeCreditTransactionOrder> {
  public constructor(
    public readonly payload: TransactionPayload<LockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<LockFeeCreditTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new LockFeeCreditTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
