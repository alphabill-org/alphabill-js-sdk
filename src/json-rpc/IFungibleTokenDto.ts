import { IStateProofDto } from './IUnitDto.js';

/**
 * Fungible token data from getUnit.
 * @interface IFungibleTokenDto
 */
export interface IFungibleTokenDto {
  readonly unitId: string;
  readonly data: {
    tokenType: string;
    value: string;
    locked: string;
    ownerPredicate: string;
    counter: string;
    timeout: string;
  };
  readonly stateProof?: IStateProofDto;
}
