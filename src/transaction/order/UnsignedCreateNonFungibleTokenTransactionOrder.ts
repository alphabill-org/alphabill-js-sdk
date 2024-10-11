import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { CreateNonFungibleTokenAttributes } from '../attribute/CreateNonFungibleTokenAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { CreateNonFungibleTokenTransactionOrder } from './types/CreateNonFungibleTokenTransactionOrder.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';

export class UnsignedCreateNonFungibleTokenTransactionOrder
  implements IUnsignedTransactionOrder<CreateNonFungibleTokenTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<CreateNonFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<CreateNonFungibleTokenTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new CreateNonFungibleTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
