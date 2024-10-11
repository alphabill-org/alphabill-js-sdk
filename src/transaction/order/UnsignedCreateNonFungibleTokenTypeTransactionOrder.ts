import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { CreateNonFungibleTokenTypeAttributes } from '../attribute/CreateNonFungibleTokenTypeAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { CreateNonFungibleTokenTypeTransactionOrder } from './CreateNonFungibleTokenTypeTransactionOrder.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';

export class UnsignedCreateNonFungibleTokenTypeTransactionOrder
  implements IUnsignedTransactionOrder<CreateNonFungibleTokenTypeTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<CreateNonFungibleTokenTypeAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<CreateNonFungibleTokenTypeTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new CreateNonFungibleTokenTypeTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
