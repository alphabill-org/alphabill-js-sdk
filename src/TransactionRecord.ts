import { ServerMetadata, ServerMetadataArray } from './ServerMetadata.js';
import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder, TransactionOrderArray } from './transaction/TransactionOrder.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { dedent } from './util/StringUtils.js';

export type TransactionRecordArray = readonly [TransactionOrderArray, ServerMetadataArray];

export class TransactionRecord<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  public constructor(
    private readonly transactionOrder: TransactionOrder<T>,
    private readonly serverMetadata: ServerMetadata,
  ) {}

  public getTransactionOrder(): TransactionOrder<T> {
    return this.transactionOrder;
  }

  public getServerMetadata(): ServerMetadata {
    return this.serverMetadata;
  }

  public toArray(): TransactionRecordArray {
    return [this.getTransactionOrder().toArray(), this.getServerMetadata().toArray()];
  }

  public toString(): string {
    return dedent`
      TransactionRecord
        ${this.transactionOrder.toString()}
        ${this.serverMetadata.toString()}`;
  }

  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionRecordArray,
  ): TransactionRecord<TransactionPayload<T>> {
    return new TransactionRecord(TransactionOrder.fromArray(data[0]), ServerMetadata.fromArray(data[1]));
  }
}
