import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';

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
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeUnsignedInteger(this.lockStatus),
      CborEncoder.encodeUnsignedInteger(this.counter),
    ]);
  }
}
