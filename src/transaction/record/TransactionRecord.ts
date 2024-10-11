import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder, TransactionOrderArray } from '../order/TransactionOrder.js';
import { ITransactionOrderProof } from '../proof/ITransactionOrderProof.js';
import { ServerMetadata, ServerMetadataArray } from './ServerMetadata.js';

/**
 * Transaction record array.
 */
export type TransactionRecordArray = readonly [TransactionOrderArray, ServerMetadataArray];

/**
 * Transaction record.
 * @template T - Transaction payload type.
 */
export class TransactionRecord<
  T extends TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof, ITransactionOrderProof>,
> {
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
