/**
 * UnitId interface.
 * @interface IUnitId
 */
export interface IUnitId {
  /**
   * Get type.
   * @returns {Uint8Array} Type.
   */
  get type(): Uint8Array;
  /**
   * Get bytes.
   * @returns {Uint8Array} Bytes.
   */
  get bytes(): Uint8Array;
}
