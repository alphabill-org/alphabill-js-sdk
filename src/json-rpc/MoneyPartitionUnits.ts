import { FeeCreditUnitType } from '../fees/FeeCreditRecordUnitType.js';
import { IUnitId } from '../IUnitId.js';
import { MoneyPartitionUnitType } from '../money/MoneyPartitionUnitType.js';
import { Base16Converter } from '../util/Base16Converter.js';

export class MoneyPartitionUnits {
  private static readonly BILL = Base16Converter.encode(MoneyPartitionUnitType.BILL);
  private static readonly FEE_CREDIT_RECORD = Base16Converter.encode(FeeCreditUnitType.FEE_CREDIT_RECORD);

  private readonly units = new Map<string, readonly IUnitId[]>();

  public constructor(unitsList: readonly IUnitId[]) {
    const units = new Map<string, IUnitId[]>();

    for (const unit of unitsList) {
      const type = Base16Converter.encode(unit.type);
      if (type !== MoneyPartitionUnits.BILL && type !== MoneyPartitionUnits.FEE_CREDIT_RECORD) {
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
    return this.units.get(MoneyPartitionUnits.BILL) ?? [];
  }

  public getFeeCreditRecords(): readonly IUnitId[] {
    return this.units.get(MoneyPartitionUnits.FEE_CREDIT_RECORD) ?? [];
  }
}
