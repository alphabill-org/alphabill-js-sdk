import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

/**
 * Unlock token attributes array.
 */
export type UnlockTokenAttributesArray = readonly [
  bigint, // Counter
];

/**
 * Unlock token payload attributes.
 */
export class UnlockTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Unlock token attributes constructor.
   * @param {bigint} counter - Counter.
   */
  public constructor(public readonly counter: bigint) {
    this.counter = BigInt(this.counter);
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<UnlockTokenAttributesArray> {
    return Promise.resolve([this.counter]);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockTokenAttributes
        Counter: ${this.counter}`;
  }

  /**
   * Create UnlockTokenAttributes from array.
   * @param {UnlockTokenAttributesArray} data Unlock token attributes array.
   * @returns {UnlockTokenAttributes} Unlock token attributes instance.
   */
  public static fromArray([counter]: UnlockTokenAttributesArray): UnlockTokenAttributes {
    return new UnlockTokenAttributes(counter);
  }
}
