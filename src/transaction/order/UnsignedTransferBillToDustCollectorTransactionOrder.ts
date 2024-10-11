import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { TransferBillToDustCollectorAttributes } from '../attribute/TransferBillToDustCollectorAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { TransferBillToDustCollectorTransactionOrder } from './types/TransferBillToDustCollectorTransactionOrder.js';

export class UnsignedTransferBillToDustCollectorTransactionOrder
  implements IUnsignedTransactionOrder<TransferBillToDustCollectorTransactionOrder>
{
  public constructor(
    public readonly payload: TransactionPayload<TransferBillToDustCollectorAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransferBillToDustCollectorTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new TransferBillToDustCollectorTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
