/**
 * @interface IUnitIdType
 */
export interface IUnitIdType {
  /**
   * Get unit identifier type bytes.
   * @returns {Uint8Array} Bytes.
   */
  get bytes(): Uint8Array;
  /**
   * Convert type to base16 string.
   * @returns {string} Base16 string.
   */
  toBase16(): string;

  /**
   * Check if type is equal to current unit id type.
   * @param other
   */
  equals(type: bigint): boolean;
}
