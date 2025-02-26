import { CborDecoder } from '../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../codec/cbor/CborEncoder.js';
import { Base64Converter } from '../util/Base64Converter.js';

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
    return `TokenIcon: ${this.type}; ${Base64Converter.encode(this._data)}`;
  }

  /**
   * Convert to raw CBOR.
   * @returns {Uint8Array} Token icon as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([CborEncoder.encodeTextString(this.type), CborEncoder.encodeByteString(this.data)]);
  }
}
