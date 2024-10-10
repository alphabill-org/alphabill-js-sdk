import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { CreateFungibleTokenAttributes } from '../attribute/CreateFungibleTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { CreateFungibleTokenTransactionOrder } from './CreateFungibleTokenTransactionOrder';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { TransactionOrder } from './TransactionOrder';

export class UnsignedCreateFungibleTokenTransactionOrder
  implements IUnsignedTransactionOrder<CreateFungibleTokenAttributes>
{
  public constructor(
    public readonly payload: TransactionPayload<CreateFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<CreateFungibleTokenAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new CreateFungibleTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
