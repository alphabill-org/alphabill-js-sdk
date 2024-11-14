import { IStateProofDto } from './IUnitDto.js';

/**
 * Non-fungible token type data from getUnit.
 * @interface INonFungibleTokenTypeDto
 */
export interface INonFungibleTokenTypeDto {
  readonly unitId: string;
  readonly networkId: string;
  readonly partitionId: string;
  readonly data: {
    symbol: string;
    name: string;
    icon: {
      type: string;
      data: string;
    };
    parentTypeId: string;
    subTypeCreationPredicate: string;
    tokenMintingPredicate: string;
    tokenTypeOwnerPredicate: string;
    dataUpdatePredicate: string;
  };
  readonly stateProof?: IStateProofDto;
}
