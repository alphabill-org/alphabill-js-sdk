import { FeeCreditUnitType } from '../fees/FeeCreditRecordUnitType.js';
import { IUnitId } from '../IUnitId.js';
import { MoneyPartitionUnitType } from '../money/MoneyPartitionUnitType.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { UnitIdResponse } from './UnitIdResponse.js';

export class MoneyPartitionUnitIdResponse extends UnitIdResponse {
  private static readonly BILL = Base16Converter.encode(MoneyPartitionUnitType.BILL);
  private static readonly FEE_CREDIT_RECORD = Base16Converter.encode(FeeCreditUnitType.FEE_CREDIT_RECORD);

  public constructor(unitIds: readonly IUnitId[]) {
    super(unitIds);
  }

  public get bills(): readonly IUnitId[] {
    return this.unitIds.get(MoneyPartitionUnitIdResponse.BILL) ?? [];
  }

  public get feeCreditRecords(): readonly IUnitId[] {
    return this.unitIds.get(MoneyPartitionUnitIdResponse.FEE_CREDIT_RECORD) ?? [];
  }
}
