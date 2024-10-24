import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Set fee credit attributes array.
 */
export type SetFeeCreditAttributesArray = readonly [
  Uint8Array, // Owner predicate
  bigint, // Amount
  bigint | null, // Counter
];

/**
 * Set fee credit payload attributes.
 */
export class SetFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Set fee credit payload attributes constructor.
   * @param {IPredicate} ownerPredicate Owner predicate to be set to the fee credit record
   * @param {Uint8Array} amount Fee credit amount to be added
   * @param {bigint} counter Transaction counter of the target fee credit record, or nil if the record does not exist yet
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly amount: bigint,
    public readonly counter: bigint | null,
  ) {
    this.amount = BigInt(this.amount);
    this.counter = this.counter ?? null;
  }

  /**
   * Create SetFeeCreditAttributes from array.
   * @param {SetFeeCreditAttributesArray} data Set fee credit attributes array.
   * @returns {SetFeeCreditAttributes} Set fee credit attributes instance.
   */
  public static fromArray([ownerPredicate, amount, counter]: SetFeeCreditAttributesArray): SetFeeCreditAttributes {
    return new SetFeeCreditAttributes(new PredicateBytes(ownerPredicate), amount, counter);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      SetFeeCreditAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Amount: ${this.amount}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<SetFeeCreditAttributesArray> {
    return Promise.resolve([this.ownerPredicate.bytes, this.amount, this.counter]);
  }
}
