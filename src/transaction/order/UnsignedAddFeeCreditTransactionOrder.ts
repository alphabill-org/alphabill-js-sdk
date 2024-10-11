import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { AddFeeCreditAttributes } from '../attribute/AddFeeCreditAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { AddFeeCreditTransactionOrder } from './types/AddFeeCreditTransactionOrder.js';

export class UnsignedAddFeeCreditTransactionOrder implements IUnsignedTransactionOrder<AddFeeCreditTransactionOrder> {
  public constructor(
    public readonly payload: TransactionPayload<AddFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {}

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<AddFeeCreditTransactionOrder> {
    return new AddFeeCreditTransactionOrder(
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
