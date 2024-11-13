import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Unlock fee credit attributes array.
 */
export type UnlockFeeCreditAttributesArray = readonly [
  bigint, // Counter
];

/**
 * Unlock fee credit payload attributes.
 */
export class UnlockFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Unlock fee credit attributes constructor.
   * @param {bigint} counter - Counter.
   */
  public constructor(public readonly counter: bigint) {
    this.counter = BigInt(this.counter);
  }

  /**
   * Create UnlockFeeCreditAttributes from array.
   * @param {UnlockFeeCreditAttributesArray} data - Unlock fee credit attributes data array.
   * @returns {UnlockFeeCreditAttributes} Unlock fee credit attributes instance.
   */
  public static fromArray([counter]: UnlockFeeCreditAttributesArray): UnlockFeeCreditAttributes {
    return new UnlockFeeCreditAttributes(counter);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockFeeCreditAttributes
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<UnlockFeeCreditAttributesArray> {
    return Promise.resolve([this.counter]);
  }
}
