/**
 * Fungible token data from getUnit.
 * @interface IFungibleTokenDto
 */
export interface IFungibleTokenDto {
  tokenType: string;
  value: number;
  lastUpdate: number;
  counter: string;
  t1: number;
  locked: number;
}
