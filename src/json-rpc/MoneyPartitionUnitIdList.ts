import { FeeCreditUnitType } from '../fees/FeeCreditRecordUnitType.js';
import { IUnitId } from '../IUnitId.js';
import { MoneyPartitionUnitType } from '../money/MoneyPartitionUnitType.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { UnitIdList } from './UnitIdList.js';

export class MoneyPartitionUnitIdList extends UnitIdList {
  private static readonly BILL = Base16Converter.encode(MoneyPartitionUnitType.BILL);
  private static readonly FEE_CREDIT_RECORD = Base16Converter.encode(FeeCreditUnitType.FEE_CREDIT_RECORD);

  public constructor(units: readonly IUnitId[]) {
    super(units);
  }

  public get bills(): readonly IUnitId[] {
    return this.units.get(MoneyPartitionUnitIdList.BILL) ?? [];
  }

  public get feeCreditRecords(): readonly IUnitId[] {
    return this.units.get(MoneyPartitionUnitIdList.FEE_CREDIT_RECORD) ?? [];
  }
}
