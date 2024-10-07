import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ISigningService } from '../../signing/ISigningService.js';
import { AddFeeCreditAttributes } from '../attribute/AddFeeCreditAttributes.js';
import { IPredicate } from '../IPredicate.js';
import { AddFeeCreditTransactionOrderSerializer } from '../serializer/AddFeeCreditTransactionOrderSerializer.js';
import { TransactionOrderType } from '../TransactionOrderType.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { IUnsignedTransactionOrder } from './IUnsignedTransactionOrder.js';
import { TransactionOrder } from './TransactionOrder.js';

export class UnsignedAddFeeCreditTransactionOrder implements IUnsignedTransactionOrder<AddFeeCreditAttributes, Uint8Array> {
  private readonly serializer: AddFeeCreditTransactionOrderSerializer;

  public constructor(
    public readonly payload: TransactionPayload<AddFeeCreditAttributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly codec: ICborCodec,
  ) {
    this.serializer = new AddFeeCreditTransactionOrderSerializer(codec);
    
  }

  public async sign(
    ownerProofSigner: ISigningService,
    feeProofSigner: ISigningService,
  ): Promise<TransactionOrder<AddFeeCreditAttributes, Uint8Array>> {
    const bytes = await this.serializer.serialize(
      new TransactionOrder<AddFeeCreditAttributes, Uint8Array>(TransactionOrderType.AddFeeCredit, this.payload, null, null, null)
    );

    return new TransactionOrder(
      TransactionOrderType.AddFeeCredit,
      this.payload,
      await ownerProofSigner.sign(bytes),
      await feeProofSigner.sign(bytes),
      this.stateUnlock,
    );
  }
}
