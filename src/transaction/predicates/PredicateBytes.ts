import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { IPredicate } from './IPredicate.js';

/**
 * Predicate bytes.
 */
export class PredicateBytes implements IPredicate {
  private readonly _bytes: Uint8Array;

  /**
   * Predicate bytes constructor.
   * @param {Uint8Array} bytes Bytes.
   */
  public constructor(bytes: Uint8Array) {
    this._bytes = new Uint8Array(bytes);
  }

  /**
   * Get bytes.
   * @returns {Uint8Array} Bytes.
   */
  public get bytes(): Uint8Array {
    return new Uint8Array(this._bytes);
  }

  /**
   * Create predicate bytes from raw CBOR.
   * @param {Uint8Array} data - bytes.
   * @returns {IPredicate} Predicate bytes.
   */
  public static fromCbor(data: Uint8Array): IPredicate | null {
    const bytes = CborDecoder.readOptional(data, CborDecoder.readByteString);
    if (bytes === null) {
      return null;
    }
    return new PredicateBytes(bytes);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return `PredicateBytes[${Base16Converter.encode(this._bytes)}]`;
  }
}
