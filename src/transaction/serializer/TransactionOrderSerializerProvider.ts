import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrderType } from '../TransactionOrderType.js';
import { AddFeeCreditTransactionOrderSerializer } from './AddFeeCreditTransactionOrderSerializer.js';
import { TransactionOrderSerializer } from './TransactionOrderSerializer.js';
import { TransferFeeCreditTransactionOrderSerializer } from './TransferFeeCreditTransactionOrderSerializer.js';

export class TransactionOrderSerializerProvider {
  private readonly serializers = new Map<
    TransactionOrderType,
    TransactionOrderSerializer<ITransactionPayloadAttributes, unknown>
  >();

  public constructor(public readonly cborCodec: ICborCodec) {
    this.serializers.set(TransactionOrderType.AddFeeCredit, new AddFeeCreditTransactionOrderSerializer(cborCodec));
    this.serializers.set(
      TransactionOrderType.TransferFeeCredit,
      new TransferFeeCreditTransactionOrderSerializer(cborCodec),
    );
  }

  public getSerializer<Attributes extends ITransactionPayloadAttributes, Proof>(
    type: TransactionOrderType,
  ): TransactionOrderSerializer<Attributes, Proof> | null {
    return (this.serializers.get(type) as TransactionOrderSerializer<Attributes, Proof>) ?? null;
  }
}
