import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { TransferFungibleTokenAttributes } from '../attribute/TransferFungibleTokenAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { TransactionOrder } from './TransactionOrder';
import { TransferFungibleTokenTransactionOrder } from './TransferFungibleTokenTransactionOrder';

export class UnsignedTransferFungibleTokenTransactionOrder
  implements IUnsignedTransactionOrder<TransferFungibleTokenAttributes>
{
  public constructor(
    public readonly payload: TransactionPayload<TransferFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<TransferFungibleTokenAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new TransferFungibleTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
