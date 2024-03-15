import { IUnit } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { IUnitDto } from './IUnitDto.js';

export interface IUnitFactory {
  createUnitId(id: Uint8Array): IUnitId;
  createUnit(data: IUnitDto): Promise<IUnit<unknown>>;
}
