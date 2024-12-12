/**
 * Fungible token type data from getUnit.
 * @interface IFungibleTokenTypeDto
 */
export interface IFungibleTokenTypeDto {
  readonly symbol: string;
  readonly name: string;
  readonly icon: {
    type: string;
    data: string;
  };
  readonly parentTypeId: string;
  readonly decimalPlaces: number;
  readonly subTypeCreationPredicate: string;
  readonly tokenMintingPredicate: string;
  readonly tokenTypeOwnerPredicate: string;
}
