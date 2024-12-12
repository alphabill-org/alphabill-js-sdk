/**
 * Non-fungible token data from getUnit.
 * @interface INonFungibleTokenDto
 */
export interface INonFungibleTokenDto {
  readonly typeId: string;
  readonly name: string;
  readonly uri: string;
  readonly data: string;
  readonly ownerPredicate: string;
  readonly dataUpdatePredicate: string;
  readonly locked: string;
  readonly counter: string;
}
