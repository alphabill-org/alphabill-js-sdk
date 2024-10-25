import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';

export abstract class UnitIdList {
  protected readonly units = new Map<string, readonly IUnitId[]>();

  protected constructor(unitsList: readonly IUnitId[]) {
    const units = new Map<string, IUnitId[]>();

    for (const unit of unitsList) {
      const type = Base16Converter.encode(unit.type);

      if (!units.has(type)) {
        units.set(type, []);
      }
      const sortedUnits = units.get(type)!;
      sortedUnits.push(unit);
    }

    for (const [type, sortedUnits] of units) {
      this.units.set(type, Object.freeze(sortedUnits));
    }
  }
}
