import { ServerMetadata, ServerMetadataArray } from './ServerMetadata.js';
import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder, TransactionOrderArray } from './transaction/TransactionOrder.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { dedent } from './util/StringUtils.js';

export type TransactionRecordArray = readonly [TransactionOrderArray, ServerMetadataArray];

export class TransactionRecord<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  public constructor(
    public readonly transactionOrder: TransactionOrder<T>,
    public readonly serverMetadata: ServerMetadata,
  ) {}

  public toArray(): TransactionRecordArray {
    return [this.transactionOrder.toArray(), this.serverMetadata.toArray()];
  }

  public toString(): string {
    return dedent`
      TransactionRecord
        ${this.transactionOrder.toString()}
        ${this.serverMetadata.toString()}`;
  }
}
