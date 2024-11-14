import { IStateProofDto } from './IUnitDto.js';

/**
 * Fee credit record data from getUnit.
 * @interface IFeeCreditRecordDto
 */
export interface IFeeCreditRecordDto {
  readonly unitId: string;
  readonly networkId: string;
  readonly partitionId: string;
  readonly data: {
    balance: string;
    ownerPredicate: string;
    locked: string;
    counter: string;
    timeout: string;
  };
  readonly stateProof?: IStateProofDto;
}
