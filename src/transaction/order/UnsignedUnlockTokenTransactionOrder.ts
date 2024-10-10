import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { UnlockTokenAttributes } from '../attribute/UnlockTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { TransactionOrder } from './TransactionOrder';
import { UnlockTokenTransactionOrder } from './UnlockTokenTransactionOrder';

export class UnsignedUnlockTokenTransactionOrder implements IUnsignedTransactionOrder<UnlockTokenAttributes> {
  public constructor(
    public readonly payload: TransactionPayload<UnlockTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<UnlockTokenAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new UnlockTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
