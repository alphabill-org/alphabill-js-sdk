/**
 * Non-fungible token data from getUnit.
 * @interface INonFungibleTokenDto
 */
export interface INonFungibleTokenDto {
  typeId: string;
  name: string;
  uri: string;
  data: string;
  ownerPredicate: string;
  dataUpdatePredicate: string;
  locked: string;
  counter: string;
}
