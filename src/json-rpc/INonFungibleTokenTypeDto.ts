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
  tokenCreationPredicate: string;
  invariantPredicate: string;
  dataUpdatePredicate: string;
}
