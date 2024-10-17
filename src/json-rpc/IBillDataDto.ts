import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { IStateProofDto } from './IUnitDto.js';

/**
 * Bill data from getUnit.
 * @interface IBillDataDto
 */
export interface IBillDataDto {
  readonly unitId: string;
  readonly ownerPredicate: string;
  readonly data: {
    value: string;
    ownerPredicate: IPredicate;
    locked: string;
    counter: string;
  };
  readonly stateProof?: IStateProofDto;
}
