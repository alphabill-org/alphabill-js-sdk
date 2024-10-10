import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { TransferNonFungibleTokenAttributes } from '../attribute/TransferNonFungibleTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { TransactionOrder } from './TransactionOrder';
import { TransferNonFungibleTokenTransactionOrder } from './TransferNonFungibleTokenTransactionOrder';

export class UnsignedTransferNonFungibletokenTransactionOrder
  implements IUnsignedTransactionOrder<TransferNonFungibleTokenAttributes>
{
  public constructor(
    public readonly payload: TransactionPayload<TransferNonFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<TransferNonFungibleTokenAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new TransferNonFungibleTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
