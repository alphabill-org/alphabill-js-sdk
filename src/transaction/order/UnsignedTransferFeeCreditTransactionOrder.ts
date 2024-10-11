import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { TransferFeeCreditAttributes } from '../attribute/TransferFeeCreditAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { TransferFeeCreditTransactionOrder } from './types/TransferFeeCreditTransactionOrder.js';

export class UnsignedTransferFeeCreditTransactionOrder
  implements IUnsignedTransactionOrder<TransferFeeCreditTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<TransferFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransferFeeCreditTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new TransferFeeCreditTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
