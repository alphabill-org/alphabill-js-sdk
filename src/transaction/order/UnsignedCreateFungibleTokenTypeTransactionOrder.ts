import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { CreateFungibleTokenTypeAttributes } from '../attribute/CreateFungibleTokenTypeAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { CreateFungibleTokenTypeTransactionOrder } from './CreateFungibleTokenTypeTransactionOrder.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';

export class UnsignedCreateFungibleTokenTypeTransactionOrder
  implements IUnsignedTransactionOrder<CreateFungibleTokenTypeTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<CreateFungibleTokenTypeAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<CreateFungibleTokenTypeTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new CreateFungibleTokenTypeTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
