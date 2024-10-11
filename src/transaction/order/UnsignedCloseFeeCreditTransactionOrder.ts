import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { CloseFeeCreditAttributes } from '../attribute/CloseFeeCreditAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { CloseFeeCreditTransactionOrder } from './CloseFeeCreditTransactionOrder.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';

export class UnsignedCloseFeeCreditTransactionOrder
  implements IUnsignedTransactionOrder<CloseFeeCreditTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<CloseFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<CloseFeeCreditTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new CloseFeeCreditTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
