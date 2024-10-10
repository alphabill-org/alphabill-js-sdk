import { ICborCodec } from '../../codec/cbor/ICborCodec';
import { ISigningService } from '../../signing/ISigningService';
import { TransferBillToDustCollectorAttributes } from '../attribute/TransferBillToDustCollectorAttributes';
import { IPredicate } from '../IPredicate';
import { TransactionPayload } from '../TransactionPayload';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder';
import { TransactionOrder } from './TransactionOrder';
import { TransferBillToDustCollectorTransactionOrder } from './TransferBillToDustCollectorTransactionOrder';

export class UnsignedTransferBillToDustCollectorTransactionOrder
  implements IUnsignedTransactionOrder<TransferBillToDustCollectorAttributes>
{
  public constructor(
    public readonly payload: TransactionPayload<TransferBillToDustCollectorAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<TransferBillToDustCollectorAttributes>> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new TransferBillToDustCollectorTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
