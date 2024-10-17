import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Lock bill attributes array.
 */
export type LockBillAttributesArray = readonly [
  bigint, // Lock Status
  bigint, // Counter
];

/**
 * Lock bill payload attributes.
 */
export class LockBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Lock bill attributes constructor.
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
   * Create LockBillAttributes from array.
   * @param {LockBillAttributesArray} data - Lock bill attributes data array.
   * @returns {LockBillAttributes} Lock bill attributes instance.
   */
  public static fromArray([lockStatus, counter]: LockBillAttributesArray): LockBillAttributes {
    return new LockBillAttributes(lockStatus, counter);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      LockBillAttributes
        Lock Status: ${this.lockStatus}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<LockBillAttributesArray> {
    return Promise.resolve([this.lockStatus, this.counter]);
  }
}
