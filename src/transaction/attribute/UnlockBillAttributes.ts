import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

/**
 * Unlock bill attributes array.
 */
export type UnlockBillAttributesArray = readonly [
  bigint, // Counter
];

/**
 * Unlock bill payload attributes.
 */
export class UnlockBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Unlock bill attributes constructor.
   * @param {Uint8Array} counter Counter.
   */
  public constructor(public readonly counter: bigint) {
    this.counter = BigInt(this.counter);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockBillAttributes
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<UnlockBillAttributesArray> {
    return Promise.resolve([this.counter]);
  }

  /**
   * Create UnlockBillAttributes from array.
   * @param {UnlockBillAttributesArray} data Unlock bill attributes array.
   * @returns {UnlockBillAttributes} Unlock bill attributes instance.
   */
  public static fromArray([counter]: UnlockBillAttributesArray): UnlockBillAttributes {
    return new UnlockBillAttributes(counter);
  }
}
