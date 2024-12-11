/**
 * Fungible token data from getUnit.
 * @interface IFungibleTokenDto
 */
export interface IFungibleTokenDto {
  typeId: string;
  value: string;
  locked: string;
  ownerPredicate: string;
  counter: string;
  minLifetime: string;
}
