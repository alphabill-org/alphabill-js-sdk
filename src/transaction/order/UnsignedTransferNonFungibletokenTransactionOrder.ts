import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { TransferNonFungibleTokenAttributes } from '../attribute/TransferNonFungibleTokenAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { TransferNonFungibleTokenTransactionOrder } from './types/TransferNonFungibleTokenTransactionOrder.js';

export class UnsignedTransferNonFungibletokenTransactionOrder
  implements IUnsignedTransactionOrder<TransferNonFungibleTokenTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<TransferNonFungibleTokenAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransferNonFungibleTokenTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new TransferNonFungibleTokenTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
