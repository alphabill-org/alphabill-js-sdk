import { CborDecoder } from '../codec/cbor/CborDecoder.js';
import { Base16Converter } from '../util/Base16Converter.js';

/**
 * Token icon array.
 */
export type TokenIconArray = readonly [string, Uint8Array];

/**
 * Token icon.
 */
export class TokenIcon {
  /**
   * Token icon constructor.
   * @param {string} type - Type.
   * @param {Uint8Array} _data - Data.
   */
  public constructor(
    public readonly type: string,
    private readonly _data: Uint8Array,
  ) {
    this._data = new Uint8Array(this._data);
  }

  /**
   * Get data.
   * @returns {Uint8Array} Data.
   */
  public get data(): Uint8Array {
    return new Uint8Array(this._data);
  }

  /**
   * Create TokenIcon from raw CBOR.
   * @param {Uint8Array} rawData - Token icon as raw CBOR.
   * @returns {TokenIcon} Token icon.
   */
  public static fromCbor(rawData: Uint8Array): TokenIcon {
    const data = CborDecoder.readArray(rawData);
    return new TokenIcon(CborDecoder.readTextString(data[0]), CborDecoder.readByteString(data[1]));
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return `TokenIcon: ${this.type}; ${Base16Converter.encode(this._data)}`;
  }

  /**
   * Convert to array.
   * @returns {TokenIconArray} Token icon array.
   */
  public encode(): TokenIconArray {
    return [this.type, this.data];
  }
}
