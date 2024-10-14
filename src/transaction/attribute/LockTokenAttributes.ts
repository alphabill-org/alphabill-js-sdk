import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

/**
 * Lock token attributes array.
 */
export type LockTokenAttributesArray = readonly [
  bigint, // Lock Status
  bigint, // Counter
];

/**
 * Lock token payload attributes.
 */
export class LockTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Lock token attributes constructor.
   * @param {bigint} lockStatus - Lock status.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly lockStatus: bigint,
    public readonly counter: bigint,
  ) {
    this.lockStatus = BigInt(this.lockStatus);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create LockTokenAttributes from array.
   * @param {LockTokenAttributesArray} data - Lock token attributes data array.
   * @returns {LockTokenAttributes} Lock token attributes instance.
   */
  public static fromArray([lockStatus, counter]: LockTokenAttributesArray): LockTokenAttributes {
    return new LockTokenAttributes(lockStatus, counter);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      LockTokenAttributes
        Lock Status: ${this.lockStatus}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<LockTokenAttributesArray> {
    return Promise.resolve([this.lockStatus, this.counter]);
  }
}
