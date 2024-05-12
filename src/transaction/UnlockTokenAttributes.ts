import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Unlock token attributes array.
 */
export type UnlockTokenAttributesArray = readonly [Uint8Array];

/**
 * Unlock token payload attributes.
 */
export class UnlockTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Unlock token attributes constructor.
   * @param {Uint8Array} _backlink - Backlink.
   */
  public constructor(private readonly _backlink: Uint8Array) {
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.UnlockTokenAttributes;
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
  public toOwnerProofData(): UnlockTokenAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): UnlockTokenAttributesArray {
    return [this.backlink];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockTokenAttributes
        Backlink: ${Base16Converter.encode(this._backlink)}`;
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
