import { IStateProofDto } from './IUnitDto.js';

/**
 * Fungible token type data from getUnit.
 * @interface IFungibleTokenTypeDto
 */
export interface IFungibleTokenTypeDto {
  readonly unitId: string;
  readonly data: {
    symbol: string;
    name: string;
    icon: {
      type: string;
      data: string;
    };
    parentTypeId: string;
    decimalPlaces: number;
    subTypeCreationPredicate: string;
    tokenMintingPredicate: string;
    tokenTypeOwnerPredicate: string;
  };
  readonly stateProof?: IStateProofDto;
}
