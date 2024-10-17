import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { IStateProofDto } from './IUnitDto.js';

/**
 * Fee credit record data from getUnit.
 * @interface IFeeCreditRecordDto
 */
export interface IFeeCreditRecordDto {
  readonly unitId: string;
  readonly ownerPredicate: string;
  readonly data: {
    balance: string;
    ownerPredicate: IPredicate;
    locked: string;
    counter: string;
    timeout: string;
  };
  readonly stateProof?: IStateProofDto;
}
