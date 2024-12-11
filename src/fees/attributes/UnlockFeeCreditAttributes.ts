import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Unlock fee credit payload attributes.
 */
export class UnlockFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Unlock fee credit attributes constructor.
   * @param {bigint} counter - Counter.
   */
  public constructor(public readonly counter: bigint) {
    this.counter = BigInt(this.counter);
  }

  /**
   * Create UnlockFeeCreditAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Unlock fee credit attributes data as raw CBOR.
   * @returns {UnlockFeeCreditAttributes} Unlock fee credit attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): UnlockFeeCreditAttributes {
    const data = CborDecoder.readArray(rawData);
    return new UnlockFeeCreditAttributes(CborDecoder.readUnsignedInteger(data[0]));
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockFeeCreditAttributes
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([CborEncoder.encodeUnsignedInteger(this.counter)]);
  }
}
