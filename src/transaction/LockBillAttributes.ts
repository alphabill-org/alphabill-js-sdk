import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Lock bill attributes array.
 */
export type LockBillAttributesArray = readonly [bigint, bigint];

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
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.LockBillAttributes;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): LockBillAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): LockBillAttributesArray {
    return [this.lockStatus, this.counter];
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
   * Create LockBillAttributes from array.
   * @param {LockBillAttributesArray} data - Lock bill attributes data array.
   * @returns {LockBillAttributes} Lock bill attributes instance.
   */
  public static fromArray(data: LockBillAttributesArray): LockBillAttributes {
    return new LockBillAttributes(data[0], data[1]);
  }
}
