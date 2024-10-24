/**
 * UnitId interface.
 * @interface IUnitId
 */
export interface IUnitId {
  /**
   * Get type.
   * @returns {bigint} Type.
   */
  get type(): bigint;
  /**
   * Get bytes.
   * @returns {Uint8Array} Bytes.
   */
  get bytes(): Uint8Array;
}
