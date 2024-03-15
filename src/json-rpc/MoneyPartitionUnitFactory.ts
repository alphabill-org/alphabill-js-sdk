import { Bill } from '../Bill.js';
import { FeeCreditRecord } from '../FeeCreditRecord.js';
import { UnitType } from '../transaction/UnitType.js';
import { IFeeCreditRecordDto } from './IFeeCreditRecordDto.js';
import { IBillDataDto } from './IBillDataDto.js';
import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { UnitFactory } from './UnitFactory.js';

export class MoneyPartitionUnitFactory extends UnitFactory {
  private static readonly BILL_DATA_HEX = Base16Converter.encode(new Uint8Array([UnitType.MONEY_PARTITION_BILL_DATA]));
  private static readonly FEE_CREDIT_RECORD_HEX = Base16Converter.encode(
    new Uint8Array([UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD]),
  );

  protected async createUnitData(unitId: IUnitId, input: unknown): Promise<unknown> {
    switch (Base16Converter.encode(unitId.getType())) {
      case MoneyPartitionUnitFactory.BILL_DATA_HEX:
        return Bill.Create(input as IBillDataDto);
      case MoneyPartitionUnitFactory.FEE_CREDIT_RECORD_HEX:
        return FeeCreditRecord.Create(input as IFeeCreditRecordDto);
    }

    return input;
  }
}
