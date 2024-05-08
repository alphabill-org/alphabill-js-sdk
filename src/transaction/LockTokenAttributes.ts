import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Lock token attributes array.
 */
export type LockTokenAttributesArray = readonly [bigint, Uint8Array];

/**
 * Lock token payload attributes.
 */
export class LockTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Lock token attributes constructor.
   * @param {bigint} lockStatus - Lock status.
   * @param {Uint8Array} _backlink - Backlink.
   */
  public constructor(
    public readonly lockStatus: bigint,
    private readonly _backlink: Uint8Array,
  ) {
    this.lockStatus = BigInt(this.lockStatus);
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.LockTokenAttributes;
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
  public toOwnerProofData(): LockTokenAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): LockTokenAttributesArray {
    return [this.lockStatus, this.backlink];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      LockTokenAttributes
        Lock Status: ${this.lockStatus}
        Backlink: ${Base16Converter.encode(this._backlink)}`;
  }

  /**
   * Create LockTokenAttributes from array.
   * @param {LockTokenAttributesArray} data - Lock token attributes data array.
   * @returns {LockTokenAttributes} Lock token attributes instance.
   */
  public static fromArray(data: LockTokenAttributesArray): LockTokenAttributes {
    return new LockTokenAttributes(data[0], data[1]);
  }
}
