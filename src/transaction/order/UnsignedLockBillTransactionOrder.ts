import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { LockBillAttributes } from '../attribute/LockBillAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { LockBillTransactionOrder } from './types/LockBillTransactionOrder.js';

export class UnsignedLockBillTransactionOrder implements IUnsignedTransactionOrder<LockBillTransactionOrder> {
  public constructor(
    public readonly payload: TransactionPayload<LockBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<LockBillTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new LockBillTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
