import { IUnitIdType } from './IUnitIdType.js';

/**
 * UnitId interface.
 * @interface IUnitId
 */
export interface IUnitId {
  /**
   * Get type.
   * @returns {IUnitIdType} Type.
   */
  get type(): IUnitIdType;
  /**
   * Get bytes.
   * @returns {Uint8Array} Bytes.
   */
  get bytes(): Uint8Array;
}
