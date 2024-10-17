import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { IStateProofDto } from './IUnitDto.js';

/**
 * Non-fungible token data from getUnit.
 * @interface INonFungibleTokenDto
 */
export interface INonFungibleTokenDto {
  readonly unitId: string;
  readonly ownerPredicate: string;
  readonly data: {
    typeID: string;
    name: string;
    uri: string;
    data: string;
    ownerPredicate: IPredicate;
    dataUpdatePredicate: string;
    locked: string;
    counter: string;
  };
  readonly stateProof?: IStateProofDto;
}