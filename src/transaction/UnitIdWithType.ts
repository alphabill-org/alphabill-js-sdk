import { UnitType } from './UnitType.js';
import { UnitId } from '../UnitId.js';

export class UnitIdWithType extends UnitId {
  public constructor(identifier: Uint8Array, type: UnitType) {
    const bytes = new Uint8Array(33);
    bytes.set(identifier, Math.max(32 - identifier.length, 0));
    bytes.set([type], 32);
    super(new Uint8Array([type]), bytes);
  }
}
