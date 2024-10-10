import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

/**
 * Lock fee credit attributes array.
 */
export type LockFeeCreditAttributesArray = readonly [
  bigint, // Lock Status
  bigint, // Counter
];

/**
 * Lock fee credit payload attributes.
 */
export class LockFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Lock fee credit attributes constructor.
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
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      LockFeeCredit
        Lock Status: ${this.lockStatus}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<LockFeeCreditAttributesArray> {
    return Promise.resolve([this.lockStatus, this.counter]);
  }

  /**
   * Create LockFeeCreditAttributes from array.
   * @param {LockFeeCreditAttributesArray} data - Lock fee credit attributes array.
   * @returns {LockFeeCreditAttributes} Lock fee credit attributes instance.
   */
  public static fromArray([lockStatus, counter]: LockFeeCreditAttributesArray): LockFeeCreditAttributes {
    return new LockFeeCreditAttributes(lockStatus, counter);
  }
}
