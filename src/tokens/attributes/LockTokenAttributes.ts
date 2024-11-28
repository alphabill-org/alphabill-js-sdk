import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Lock token attributes array.
 */
export type LockTokenAttributesArray = readonly [
  bigint, // Lock Status
  bigint, // Counter
];

/**
 * Lock token payload attributes.
 */
export class LockTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Lock token attributes constructor.
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
   * Create LockTokenAttributes from raw CBOR.
   * @param {LockTokenAttributesArray} rawData - Lock token attributes data as raw CBOR.
   * @returns {LockTokenAttributes} Lock token attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): LockTokenAttributes {
    const data = CborDecoder.readArray(rawData);
    return new LockTokenAttributes(CborDecoder.readUnsignedInteger(data[0]), CborDecoder.readUnsignedInteger(data[1]));
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      LockTokenAttributes
        Lock Status: ${this.lockStatus}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<LockTokenAttributesArray> {
    return Promise.resolve([this.lockStatus, this.counter]);
  }
}
