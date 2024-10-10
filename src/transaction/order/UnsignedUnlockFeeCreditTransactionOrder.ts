import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { UnlockFeeCreditAttributes } from '../attribute/UnlockFeeCreditAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { TransactionOrder } from './TransactionOrder';
import { UnlockFeeCreditTransactionOrder } from './UnlockFeeCreditTransactionOrder';

export class UnsignedUnlockFeeCreditTransactionOrder implements IUnsignedTransactionOrder<UnlockFeeCreditAttributes> {
  public constructor(
    public readonly payload: TransactionPayload<UnlockFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<UnlockFeeCreditAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new UnlockFeeCreditTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}