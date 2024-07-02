/**
 * Non Fungible token data from getUnit.
 * @interface INonFungibleTokenDto
 */
export interface INonFungibleTokenDto {
  NftType: string;
  Name: string;
  URI: string;
  Data: string;
  DataUpdatePredicate: string;
  T: string;
  Counter: string;
  Locked: number;
}
