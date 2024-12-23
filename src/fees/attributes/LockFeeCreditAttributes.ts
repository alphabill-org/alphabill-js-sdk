import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Lock fee credit payload attributes.
 */
export class LockFeeCreditAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'LockFeeCreditAttributes';

  /**
   * Lock fee credit attributes constructor.
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
   * Create LockFeeCreditAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Lock fee credit attributes as raw CBOR.
   * @returns {LockFeeCreditAttributes} Lock fee credit attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): LockFeeCreditAttributes {
    const data = CborDecoder.readArray(rawData);
    return new LockFeeCreditAttributes(
      CborDecoder.readUnsignedInteger(data[0]),
      CborDecoder.readUnsignedInteger(data[1]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      LockFeeCredit
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
