import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Lock bill attributes array.
 */
export type LockBillAttributesArray = readonly [bigint, Uint8Array];

/**
 * Lock bill payload attributes.
 */
export class LockBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Lock bill attributes constructor.
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
    return PayloadType.LockBillAttributes;
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
  public toOwnerProofData(): LockBillAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): LockBillAttributesArray {
    return [this.lockStatus, this.backlink];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      LockBillAttributes
        Lock Status: ${this.lockStatus}
        Backlink: ${Base16Converter.encode(this._backlink)}`;
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
