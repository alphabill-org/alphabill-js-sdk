import { numberToBytesBE } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { IUnitId } from '../IUnitId.js';
import { IPredicate } from './IPredicate.js';
import { UnitIdWithType } from './UnitIdWithType.js';
import { UnitType } from './UnitType.js';

export class FeeCreditRecordUnitIdFactory {
  public create(timeout: bigint, ownerPredicate: IPredicate, unitType: UnitType): IUnitId {
    const unitBytes = sha256.create().update(ownerPredicate.bytes).update(numberToBytesBE(timeout, 8)).digest();
    return new UnitIdWithType(unitBytes, unitType);
  }
}
