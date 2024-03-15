import { IUnitFactory } from './IUnitFactory.js';
import { IUnitId } from '../IUnitId.js';
import { IUnitDto } from './IUnitDto.js';
import { IUnit } from '../IUnit.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { UnitId } from '../UnitId.js';

export abstract class UnitFactory implements IUnitFactory {
  public static createUnitIdFromBytes(id: Uint8Array): IUnitId {
    return new UnitId(id.slice(-1), id);
  }

  public createUnitId(id: Uint8Array): IUnitId {
    return UnitFactory.createUnitIdFromBytes(id);
  }

  public async createUnit(data: IUnitDto): Promise<IUnit<unknown>> {
    const unitId = this.createUnitId(Base16Converter.decode(data.unitId.substring(2)));
    return {
      unitId,
      data: await this.createUnitData(unitId, data.data),
      ownerPredicate: Base16Converter.decode(data.ownerPredicate),
      // TODO: Parse stateproof
      stateProof: undefined,
    };
  }

  protected abstract createUnitData(unitId: IUnitId, data: unknown): Promise<unknown>;
}
