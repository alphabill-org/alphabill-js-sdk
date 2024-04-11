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
   * Convert to array.
   * @returns {TokenIconArray} Token icon array.
   */
  public toArray(): TokenIconArray {
    return [this.type, this.data];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return `TokenIcon: ${this.type}; ${Base16Converter.encode(this._data)}`;
  }

  /**
   * Create TokenIcon from array.
   * @param {TokenIconArray} data - Token icon array.
   * @returns {TokenIcon} Token icon.
   */
  public static fromArray(data: TokenIconArray): TokenIcon {
    return new TokenIcon(data[0], data[1]);
  }
}
