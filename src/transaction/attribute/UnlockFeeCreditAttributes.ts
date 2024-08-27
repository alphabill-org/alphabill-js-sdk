import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { PayloadType } from '../PayloadAttributeFactory.js';

/**
 * Unlock fee credit attributes array.
 */
export type UnlockFeeCreditAttributesArray = readonly [bigint];

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
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.UnlockFeeCreditAttributes;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): UnlockFeeCreditAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): UnlockFeeCreditAttributesArray {
    return [this.counter];
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
   * Create UnlockFeeCreditAttributes from array.
   * @param {UnlockFeeCreditAttributesArray} data - Unlock fee credit attributes data array.
   * @returns {UnlockFeeCreditAttributes} Unlock fee credit attributes instance.
   */
  public static fromArray(data: UnlockFeeCreditAttributesArray): UnlockFeeCreditAttributes {
    return new UnlockFeeCreditAttributes(data[0]);
  }
}
