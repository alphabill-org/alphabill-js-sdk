import { SystemIdentifier } from '../SystemIdentifier.js';
import { UnitIdWithType } from './UnitIdWithType.js';
import { UnitType } from './UnitType.js';

type FeeCreditRecordPartition = SystemIdentifier.MONEY_PARTITION | SystemIdentifier.TOKEN_PARTITION;

export class FeeCreditUnitId extends UnitIdWithType {
  public constructor(identifier: Uint8Array, type: FeeCreditRecordPartition) {
    super(identifier, FeeCreditUnitId.getUnitType(type));
  }

  private static getUnitType(systemIdentifier: SystemIdentifier): UnitType {
    switch (systemIdentifier) {
      case SystemIdentifier.MONEY_PARTITION:
        return UnitType.MONEY_PARTITION_FEE_CREDIT_RECORD;
      case SystemIdentifier.TOKEN_PARTITION:
        return UnitType.TOKEN_PARTITION_FEE_CREDIT_RECORD;
    }

    throw new Error('Unsupported system identifier');
  }
}
