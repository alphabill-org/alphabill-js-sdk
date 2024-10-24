import { IUnitId } from '../IUnitId.js';
import { MoneyPartitionUnitType } from '../money/MoneyPartitionUnitType.js';

export class MoneyPartitionUnits {
  private readonly units = new Map<MoneyPartitionUnitType, readonly IUnitId[]>();

  public constructor(unitsList: readonly IUnitId[]) {
    const units = new Map<MoneyPartitionUnitType, IUnitId[]>();

    for (const unit of unitsList) {
      const type = Number(unit.type) as MoneyPartitionUnitType;
      if (!MoneyPartitionUnitType[type]) {
        console.warn(`Unknown type in money partition: ${unit.type}`);
        continue;
      }

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

  public getBills(): readonly IUnitId[] {
    return this.units.get(MoneyPartitionUnitType.BILL) ?? [];
  }

  public getFeeCreditRecords(): readonly IUnitId[] {
    return this.units.get(MoneyPartitionUnitType.FEE_CREDIT_RECORD) ?? [];
  }
}
