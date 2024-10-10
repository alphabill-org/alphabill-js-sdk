import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { SwapBillsWithDustCollectorAttributes } from '../attribute/SwapBillsWithDustCollectorAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { SwapBillsWithDustCollectorTransactionOrder } from './SwapBillsWithDustCollectorTransactionOrder';
import { TransactionOrder } from './TransactionOrder';

export class UnsignedSwapBillsWithDustCollectorTransactionOrder
  implements IUnsignedTransactionOrder<SwapBillsWithDustCollectorAttributes>
{
  public constructor(
    public readonly payload: TransactionPayload<SwapBillsWithDustCollectorAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<SwapBillsWithDustCollectorAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new SwapBillsWithDustCollectorTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
