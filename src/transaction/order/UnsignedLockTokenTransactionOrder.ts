import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { LockTokenAttributes } from '../attribute/LockTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { LockTokenTransactionOrder } from './LockTokenTransactionOrder';
import { TransactionOrder } from './TransactionOrder';

export class UnsignedLockTokenTransactionOrder implements IUnsignedTransactionOrder<LockTokenAttributes> {
  public constructor(
    public readonly payload: TransactionPayload<LockTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<LockTokenAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new LockTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
