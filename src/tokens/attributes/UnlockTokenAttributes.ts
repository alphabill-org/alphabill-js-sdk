import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Unlock token payload attributes.
 */
export class UnlockTokenAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'UnlockTokenAttributes';

  /**
   * Unlock token attributes constructor.
   * @param {bigint} counter - Counter.
   */
  public constructor(public readonly counter: bigint) {
    this.counter = BigInt(this.counter);
  }

  /**
   * Create UnlockTokenAttributes from raw CBOR.
   * @param {Uint8Array} rawData Unlock token attributes as raw CBOR.
   * @returns {UnlockTokenAttributes} Unlock token attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): UnlockTokenAttributes {
    const data = CborDecoder.readArray(rawData);
    return new UnlockTokenAttributes(CborDecoder.readUnsignedInteger(data[0]));
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([CborEncoder.encodeUnsignedInteger(this.counter)]);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockTokenAttributes
        Counter: ${this.counter}`;
  }
}
