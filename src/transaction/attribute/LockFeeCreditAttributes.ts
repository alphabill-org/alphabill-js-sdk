import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { PayloadType } from '../PayloadAttributeFactory.js';

/**
 * Lock fee credit attributes array.
 */
export type LockFeeCreditAttributesArray = readonly [bigint, bigint];

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
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.LockFeeCreditAttributes;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): LockFeeCreditAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): LockFeeCreditAttributesArray {
    return [this.lockStatus, this.counter];
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
   * Create LockFeeCreditAttributes from array.
   * @param {LockFeeCreditAttributesArray} data - Lock fee credit attributes array.
   * @returns {LockFeeCreditAttributes} Lock fee credit attributes instance.
   */
  public static fromArray(data: LockFeeCreditAttributesArray): LockFeeCreditAttributes {
    return new LockFeeCreditAttributes(data[0], data[1]);
  }
}
