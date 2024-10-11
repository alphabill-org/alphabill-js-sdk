import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { ReclaimFeeCreditAttributes } from '../attribute/ReclaimFeeCreditAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { ReclaimFeeCreditTransactionOrder } from './ReclaimFeeCreditTransactionOrder.js';

export class UnsignedReclaimFeeCreditTransactionOrder
  implements IUnsignedTransactionOrder<ReclaimFeeCreditTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<ReclaimFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<ReclaimFeeCreditTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new ReclaimFeeCreditTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
