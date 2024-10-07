import { ServerMetadata } from './ServerMetadata.js';
import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from './transaction/order/TransactionOrder.js';
import { dedent } from './util/StringUtils.js';

/**
 * Transaction record.
 * @template T - Transaction payload type.
 */
export class TransactionRecord<Attributes extends ITransactionPayloadAttributes, Proof> {
  /**
   * Transaction record constructor.
   * @param {TransactionOrder<T>} transactionOrder - transaction order.
   * @param {ServerMetadata} serverMetadata - server metadata.
   */
  public constructor(
    public readonly transactionOrder: TransactionOrder<Attributes, Proof>,
    public readonly serverMetadata: ServerMetadata,
  ) {}

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
}
