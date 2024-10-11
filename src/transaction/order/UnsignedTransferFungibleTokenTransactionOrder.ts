import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { TransferFungibleTokenAttributes } from '../attribute/TransferFungibleTokenAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { TransferFungibleTokenTransactionOrder } from './types/TransferFungibleTokenTransactionOrder.js';

export class UnsignedTransferFungibleTokenTransactionOrder
  implements IUnsignedTransactionOrder<TransferFungibleTokenTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<TransferFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransferFungibleTokenTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new TransferFungibleTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
