import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';

export abstract class UnitIdResponse {
  protected readonly unitIds = new Map<string, readonly IUnitId[]>();

  protected constructor(unitIds: readonly IUnitId[]) {
    const unitIdMap = new Map<string, IUnitId[]>();

    for (const unit of unitIds) {
      const type = Base16Converter.encode(unit.type);

      if (!unitIdMap.has(type)) {
        unitIdMap.set(type, []);
      }

      const sortedUnits = unitIdMap.get(type)!;
      sortedUnits.push(unit);
    }

    for (const [type, sortedUnits] of unitIdMap) {
      this.unitIds.set(type, Object.freeze(sortedUnits));
    }
  }
}
