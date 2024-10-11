import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { SplitBillAttributes } from '../attribute/SplitBillAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { SplitBillTransactionOrder } from './types/SplitBillTransactionOrder.js';

export class UnsignedSplitBillTransactionOrder implements IUnsignedTransactionOrder<SplitBillTransactionOrder> {
  public constructor(
    public readonly payload: TransactionPayload<SplitBillAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<SplitBillTransactionOrder> {
    const bytes = await this.codec.encode(this.payload.toArray());
    return new SplitBillTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
