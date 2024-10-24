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
  public constructor(identifier: Uint8Array, type: Uint8Array) {
    const bytes = new Uint8Array(33);
    bytes.set(identifier, Math.max(32 - identifier.length, 0));
    bytes.set(type, 33 - type.length);
    super(type, bytes);
  }
}
