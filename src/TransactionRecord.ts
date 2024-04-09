import { ServerMetadata, ServerMetadataArray } from './ServerMetadata.js';
import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder, TransactionOrderArray } from './transaction/TransactionOrder.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { dedent } from './util/StringUtils.js';

/**
 * Transaction record array.
 */
export type TransactionRecordArray = readonly [TransactionOrderArray, ServerMetadataArray];

/**
 * Transaction record.
 * @template T - Transaction payload type.
 */
export class TransactionRecord<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  /**
   * Transaction record constructor.
   * @param {TransactionOrder<T>} transactionOrder - transaction order.
   * @param {ServerMetadata} serverMetadata - server metadata.
   */
  public constructor(
    public readonly transactionOrder: TransactionOrder<T>,
    public readonly serverMetadata: ServerMetadata,
  ) {}

  /**
   * Convert to array.
   * @returns {TransactionRecordArray} Transaction record array.
   */
  public toArray(): TransactionRecordArray {
    return [this.transactionOrder.toArray(), this.serverMetadata.toArray()];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionRecord
        ${this.transactionOrder.toString()}
        ${this.serverMetadata.toString()}`;
  }

  /**
   * Create transaction record from array.
   * @param {TransactionRecordArray} data - Transaction record array.
   * @returns {TransactionRecord} Transaction record.
   */
  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionRecordArray,
  ): TransactionRecord<TransactionPayload<T>> {
    return new TransactionRecord(TransactionOrder.fromArray(data[0]), ServerMetadata.fromArray(data[1]));
  }
}
