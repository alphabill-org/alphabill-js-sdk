/**
 * Fungible token type data from getUnit.
 * @interface IFungibleTokenTypeDto
 */
export interface IFungibleTokenTypeDto {
  symbol: string;
  name: string;
  icon: {
    type: string;
    data: string;
  };
  parentTypeId: string;
  decimalPlaces: number;
  subTypeCreationPredicate: string;
  tokenCreationPredicate: string;
  invariantPredicate: string;
}
