import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { UpdateNonFungibleTokenAttributes } from '../attribute/UpdateNonFungibleTokenAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { UpdateNonFungibleTokenTransactionOrder } from './types/UpdateNonFungibleTokenTransactionOrder.js';

export class UnsignedUpdateNonFungibleTokenTransactionOrder
  implements IUnsignedTransactionOrder<UpdateNonFungibleTokenTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<UpdateNonFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<UpdateNonFungibleTokenTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new UpdateNonFungibleTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
