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
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return `PredicateBytes[${Base16Converter.encode(this._bytes)}]`;
  }
}
