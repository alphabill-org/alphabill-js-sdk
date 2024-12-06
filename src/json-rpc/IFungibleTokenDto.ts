/**
 * Fungible token data from getUnit.
 * @interface IFungibleTokenDto
 */
export interface IFungibleTokenDto {
  tokenType: string;
  value: string;
  locked: string;
  ownerPredicate: string;
  counter: string;
  timeout: string;
}
