/**
 * Non-fungible token type data from getUnit.
 * @interface INonFungibleTokenTypeDto
 */
export interface INonFungibleTokenTypeDto {
  readonly version: bigint;
  readonly symbol: string;
  readonly name: string | null;
  readonly icon: Readonly<{
    type: string;
    data: string;
  } | null>;
  readonly parentTypeId: string | null;
  readonly subTypeCreationPredicate: string;
  readonly tokenMintingPredicate: string;
  readonly tokenTypeOwnerPredicate: string;
  readonly dataUpdatePredicate: string;
}
