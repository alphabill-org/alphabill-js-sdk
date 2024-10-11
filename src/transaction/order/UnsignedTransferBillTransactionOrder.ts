import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { TransferBillAttributes } from '../attribute/TransferBillAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { TransferBillTransactionOrder } from './TransferBillTransactionOrder.js';

export class UnsignedTransferBillTransactionOrder implements IUnsignedTransactionOrder<TransferBillTransactionOrder> {
  public constructor(
    public readonly payload: TransactionPayload<TransferBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransferBillTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new TransferBillTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
