import { IUnitIdType } from './IUnitIdType.js';

/**
 * UnitId interface.
 */
export interface IUnitId {
  /**
   * Get type.
   * @returns {IUnitIdType} Type.
   */
  getType(): IUnitIdType;
  /**
   * Get bytes.
   * @returns {Uint8Array} Bytes.
   */
  getBytes(): Uint8Array;
}
