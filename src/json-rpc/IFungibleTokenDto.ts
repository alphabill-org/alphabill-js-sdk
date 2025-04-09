/**
 * Fungible token data from getUnit.
 * @interface IFungibleTokenDto
 */
export interface IFungibleTokenDto {
  readonly version: bigint;
  readonly typeId: string;
  readonly value: string;
  readonly ownerPredicate: string;
  readonly counter: string;
  readonly minLifetime: string;
}
