import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Unlock bill attributes array.
 */
export type UnlockBillAttributesArray = readonly [Uint8Array];

/**
 * Unlock bill payload attributes.
 */
export class UnlockBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Unlock bill attributes constructor.
   * @param {Uint8Array} _backlink - Backlink.
   */
  public constructor(private readonly _backlink: Uint8Array) {
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.UnlockBillAttributes;
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
  public toOwnerProofData(): UnlockBillAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): UnlockBillAttributesArray {
    return [this.backlink];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockBillAttributes
        Backlink: ${Base16Converter.encode(this._backlink)}`;
  }

  /**
   * Create UnlockBillAttributes from array.
   * @param {UnlockBillAttributesArray} data Unlock bill attributes array.
   * @returns {UnlockBillAttributes} Unlock bill attributes instance.
   */
  public static fromArray(data: UnlockBillAttributesArray): UnlockBillAttributes {
    return new UnlockBillAttributes(data[0]);
  }
}
