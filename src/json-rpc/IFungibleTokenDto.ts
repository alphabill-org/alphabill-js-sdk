/**
 * Fungible token data from getUnit.
 * @interface IFungibleTokenDto
 */
export interface IFungibleTokenDto {
  TokenType: string;
  Value: number;
  T: string;
  Backlink: string;
  Locked: number;
}
