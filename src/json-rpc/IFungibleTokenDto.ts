/**
 * Fungible token data from getUnit.
 * @interface IFungibleTokenDto
 */
export interface IFungibleTokenDto {
  readonly typeId: string;
  readonly value: string;
  readonly locked: string;
  readonly ownerPredicate: string;
  readonly counter: string;
  readonly minLifetime: string;
}
