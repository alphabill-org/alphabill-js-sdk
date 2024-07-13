/**
 * Non Fungible token data from getUnit.
 * @interface INonFungibleTokenDto
 */
export interface INonFungibleTokenDto {
  typeID: string;
  name: string;
  uri: string;
  data: string;
  dataUpdatePredicate: string;
  lastUpdate: number;
  counter: string;
  locked: number;
}
