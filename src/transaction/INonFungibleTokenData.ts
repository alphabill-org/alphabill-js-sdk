/**
 * Non fungible token data.
 * @interface INonFungibleTokenData
 */
export interface INonFungibleTokenData {
  /**
   * Non fungible token data bytes.
   * @returns {Uint8Array}
   */
  get bytes(): Uint8Array;
}
