import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { CloseFeeCreditAttributes } from '../attribute/CloseFeeCreditAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { CloseFeeCreditTransactionOrder } from './CloseFeeCreditTransactionOrder';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { TransactionOrder } from './TransactionOrder';

export class UnsignedCloseFeeCreditTransactionOrder implements IUnsignedTransactionOrder<CloseFeeCreditAttributes> {
  public constructor(
    public readonly payload: TransactionPayload<CloseFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<CloseFeeCreditAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new CloseFeeCreditTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
