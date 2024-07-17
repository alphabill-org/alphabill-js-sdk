/**
 * Non-fungible token data from getUnit.
 * @interface INonFungibleTokenDto
 */
export interface INonFungibleTokenDto {
  typeID: string;
  name: string;
  uri: string;
  data: string;
  dataUpdatePredicate: string;
  lastUpdate: string;
  counter: string;
  locked: string;
}
