import { UnitId } from '../UnitId.js';

/**
 * Unit id with type.
 */
export class UnitIdWithType extends UnitId {
  /**
   * Unit id with type constructor.
   * @param {Uint8Array} identifier - Identifier.
   * @param {number} type - Type.
   */
  public constructor(identifier: Uint8Array, type: number) {
    const bytes = new Uint8Array(33);
    bytes.set(identifier, Math.max(32 - identifier.length, 0));
    bytes.set([Number(type)], 32);
    super(new Uint8Array([Number(type)]), bytes);
  }
}
