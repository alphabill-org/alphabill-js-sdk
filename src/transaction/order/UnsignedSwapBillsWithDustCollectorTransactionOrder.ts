import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SwapBillsWithDustCollectorAttributes } from '../attribute/SwapBillsWithDustCollectorAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { SwapBillsWithDustCollectorTransactionOrder } from './types/SwapBillsWithDustCollectorTransactionOrder.js';

export class UnsignedSwapBillsWithDustCollectorTransactionOrder
  implements IUnsignedTransactionOrder<SwapBillsWithDustCollectorTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<SwapBillsWithDustCollectorAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<SwapBillsWithDustCollectorTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new SwapBillsWithDustCollectorTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
