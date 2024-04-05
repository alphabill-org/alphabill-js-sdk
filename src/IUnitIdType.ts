export interface IUnitIdType {
  /**
   * Convert type to base16 string.
   * @returns {string} Base16 string.
   */
  toBase16(): string;
  /**
   * Get type bytes.
   * @returns {Uint8Array} Bytes.
   */
  getBytes(): Uint8Array;
}
