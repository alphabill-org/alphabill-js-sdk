import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Unlock fee credit attributes array.
 */
export type UnlockFeeCreditAttributesArray = readonly [Uint8Array];

/**
 * Unlock fee credit payload attributes.
 */
export class UnlockFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Unlock fee credit attributes constructor.
   * @param {Uint8Array} _backlink - Backlink.
   */
  public constructor(private readonly _backlink: Uint8Array) {
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.UnlockFeeCreditAttributes;
  }

  /**
   * Get backlink.
   * @returns {Uint8Array} Backlink.
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
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
    return [this.backlink];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockFeeCreditAttributes
        Backlink: ${this._backlink}`;
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
