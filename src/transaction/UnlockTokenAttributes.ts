import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Unlock token attributes array.
 */
export type UnlockTokenAttributesArray = readonly [bigint];

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
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.UnlockTokenAttributes;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): UnlockTokenAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): UnlockTokenAttributesArray {
    return [this.counter];
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
  public static fromArray(data: UnlockTokenAttributesArray): UnlockTokenAttributes {
    return new UnlockTokenAttributes(data[0]);
  }
}
