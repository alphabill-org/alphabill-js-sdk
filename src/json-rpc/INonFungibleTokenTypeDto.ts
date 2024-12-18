/**
 * Non-fungible token type data from getUnit.
 * @interface INonFungibleTokenTypeDto
 */
export interface INonFungibleTokenTypeDto {
  readonly symbol: string;
  readonly name: string;
  readonly icon: Readonly<{
    type: string;
    data: string;
  }>;
  readonly parentTypeId: string;
  readonly subTypeCreationPredicate: string;
  readonly tokenMintingPredicate: string;
  readonly tokenTypeOwnerPredicate: string;
  readonly dataUpdatePredicate: string;
}
