import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { PredicateBytes } from '../predicate/PredicateBytes.js';

/**
 * Transfer bill attributes array.
 */
export type TransferBillAttributesArray = [
  bigint, // Target Value
  Uint8Array, // Owner Predicate
  bigint, // Counter
];

/**
 * Transfer bill payload attributes.
 */
export class TransferBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer bill attributes constructor.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} targetValue - Target value.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly targetValue: bigint,
    public readonly counter: bigint,
  ) {
    this.targetValue = BigInt(this.targetValue);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create TransferBillAttributes from array.
   * @param {TransferBillAttributesArray} data - Transfer bill attributes array.
   * @returns {TransferBillAttributes} Transfer bill attributes instance.
   */
  public static fromArray([targetValue, ownerPredicate, counter]: TransferBillAttributesArray): TransferBillAttributes {
    return new TransferBillAttributes(new PredicateBytes(ownerPredicate), targetValue, counter);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferBillAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Target Value: ${this.targetValue}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<TransferBillAttributesArray> {
    return Promise.resolve([this.targetValue, this.ownerPredicate.bytes, this.counter]);
  }
}
