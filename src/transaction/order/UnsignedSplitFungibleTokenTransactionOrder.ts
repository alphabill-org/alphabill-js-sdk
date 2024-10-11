import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SplitFungibleTokenAttributes } from '../attribute/SplitFungibleTokenAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { SplitFungibleTokenTransactionOrder } from './types/SplitFungibleTokenTransactionOrder.js';

export class UnsignedSplitFungibleTokenTransactionOrder
  implements IUnsignedTransactionOrder<SplitFungibleTokenTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<SplitFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<SplitFungibleTokenTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new SplitFungibleTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
