import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';

export abstract class UnitIdResponse {
  protected readonly unitIds = new Map<string, readonly IUnitId[]>();

  protected constructor(unitIds: readonly IUnitId[]) {
    const groupedUnitIds = new Map<string, IUnitId[]>();

    for (const id of unitIds) {
      const type = Base16Converter.encode(id.type);

      if (!groupedUnitIds.has(type)) {
        groupedUnitIds.set(type, []);
      }

      const typeUnitIds = groupedUnitIds.get(type)!;
      typeUnitIds.push(id);
    }

    for (const [type, typeUnitIds] of groupedUnitIds) {
      this.unitIds.set(type, Object.freeze(typeUnitIds));
    }
  }
}
