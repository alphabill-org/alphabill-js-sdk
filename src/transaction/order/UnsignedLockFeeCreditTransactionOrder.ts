import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { LockFeeCreditAttributes } from '../attribute/LockFeeCreditAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { LockFeeCreditTransactionOrder } from './LockFeeCreditTransactionOrder';
import { TransactionOrder } from './TransactionOrder';

export class UnsignedLockFeeCreditTransactionOrder implements IUnsignedTransactionOrder<LockFeeCreditAttributes> {
  public constructor(
    public readonly payload: TransactionPayload<LockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<LockFeeCreditAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new LockFeeCreditTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
