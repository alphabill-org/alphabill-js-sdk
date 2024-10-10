import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { LockBillAttributes } from '../attribute/LockBillAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { LockBillTransactionOrder } from './LockBillTransactionOrder';
import { TransactionOrder } from './TransactionOrder';

export class UnsignedLockBillTransactionOrder implements IUnsignedTransactionOrder<LockBillAttributes> {
  public constructor(
    public readonly payload: TransactionPayload<LockBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<LockBillAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new LockBillTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
