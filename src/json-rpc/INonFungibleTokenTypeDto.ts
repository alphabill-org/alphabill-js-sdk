/**
 * Non-fungible token type data from getUnit.
 * @interface INonFungibleTokenTypeDto
 */
export interface INonFungibleTokenTypeDto {
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
}
