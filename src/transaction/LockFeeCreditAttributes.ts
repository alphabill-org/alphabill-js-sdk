import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Lock fee credit attributes array.
 */
export type LockFeeCreditAttributesArray = readonly [bigint, Uint8Array];

/**
 * Lock fee credit payload attributes.
 */
export class LockFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Lock fee credit attributes constructor.
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
    return PayloadType.LockFeeCreditAttributes;
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
  public toOwnerProofData(): LockFeeCreditAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): LockFeeCreditAttributesArray {
    return [this.lockStatus, this.backlink];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      LockFeeCredit
        Lock Status: ${this.lockStatus}
        Backlink: ${Base16Converter.encode(this._backlink)}`;
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
