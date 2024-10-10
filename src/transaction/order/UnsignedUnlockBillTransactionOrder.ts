import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { UnlockBillAttributes } from '../attribute/UnlockBillAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { TransactionOrder } from './TransactionOrder';
import { UnlockBillTransactionOrder } from './UnlockBillTransactionOrder';

export class UnsignedUnlockBillTransactionOrder implements IUnsignedTransactionOrder<UnlockBillAttributes> {
  public constructor(
    public readonly payload: TransactionPayload<UnlockBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<UnlockBillAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new UnlockBillTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
