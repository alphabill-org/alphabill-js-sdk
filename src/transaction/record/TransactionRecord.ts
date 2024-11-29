import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../order/TransactionOrder.js';
import { ITransactionOrderProof } from '../proofs/ITransactionOrderProof.js';
import { ServerMetadata } from './ServerMetadata.js';

/**
 * Transaction record.
 * @template T - Transaction payload type.
 */
export class TransactionRecord<T extends TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof>> {
  /**
   * Transaction record constructor.
   * @param {TransactionOrder<T>} transactionOrder - transaction order.
   * @param {ServerMetadata} serverMetadata - server metadata.
   */
  public constructor(
    public readonly transactionOrder: T,
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
