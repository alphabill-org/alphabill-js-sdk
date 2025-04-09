/**
 * Non-fungible token data from getUnit.
 * @interface INonFungibleTokenDto
 */
export interface INonFungibleTokenDto {
  readonly version: bigint;
  readonly typeId: string;
  readonly name: string | null;
  readonly uri: string | null;
  readonly data: string | null;
  readonly ownerPredicate: string;
  readonly dataUpdatePredicate: string;
  readonly counter: string;
}
