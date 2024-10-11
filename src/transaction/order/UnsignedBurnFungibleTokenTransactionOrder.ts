import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { BurnFungibleTokenAttributes } from '../attribute/BurnFungibleTokenAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { BurnFungibleTokenTransactionOrder } from './BurnFungibleTokenTransactionOrder.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';

export class UnsignedBurnFungibleTokenTransactionOrder
  implements IUnsignedTransactionOrder<BurnFungibleTokenTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<BurnFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<BurnFungibleTokenTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new BurnFungibleTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
