import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Lock bill attributes array.
 */
export type LockBillAttributesArray = readonly [
  bigint, // Lock Status
  bigint, // Counter
];

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
   * Create LockBillAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Lock bill attributes data as raw CBOR.
   * @returns {LockBillAttributes} Lock bill attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): LockBillAttributes {
    const data = CborDecoder.readArray(rawData);
    return new LockBillAttributes(CborDecoder.readUnsignedInteger(data[0]), CborDecoder.readUnsignedInteger(data[1]));
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
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<LockBillAttributesArray> {
    return Promise.resolve([this.lockStatus, this.counter]);
  }
}
