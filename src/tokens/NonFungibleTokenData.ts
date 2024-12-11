import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { INonFungibleTokenData } from './INonFungibleTokenData.js';

/**
 * Non-fungible token data.
 */
export class NonFungibleTokenData implements INonFungibleTokenData {
  private constructor(private readonly data: Uint8Array) {
    this.data = new Uint8Array(this.data);
  }

  /**
   * Get bytes.
   * @returns {Uint8Array} Bytes.
   */
  public get bytes(): Uint8Array {
    return new Uint8Array(this.data);
  }

  /**
   * Create non-fungible token data.
   * @param {Uint8Array} data - Data.
   * @returns {Promise<NonFungibleTokenData>} Non-fungible token data.
   */
  public static create(data: Uint8Array): NonFungibleTokenData {
    return new NonFungibleTokenData(data);
  }

  /**
   * Create non-fungible token data from bytes.
   * @param {Uint8Array} data - Data.
   * @returns {NonFungibleTokenData} Non-fungible token data.
   */
  public static createFromBytes(data: Uint8Array): NonFungibleTokenData {
    return new NonFungibleTokenData(data);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      NonFungibleTokenData: ${Base16Converter.encode(this.data)}`;
  }
}
