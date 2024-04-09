/**
 * @interface IUnitIdType
 */
export interface IUnitIdType {
  /**
   * Convert type to base16 string.
   * @returns {string} Base16 string.
   */
  toBase16(): string;
  /**
   * Get unit identifier type bytes.
   * @returns {Uint8Array} Bytes.
   */
  get bytes(): Uint8Array;
}
