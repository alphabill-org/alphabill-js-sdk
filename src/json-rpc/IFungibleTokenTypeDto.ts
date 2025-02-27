/**
 * Fungible token type data from getUnit.
 * @interface IFungibleTokenTypeDto
 */
export interface IFungibleTokenTypeDto {
  readonly version: bigint;
  readonly symbol: string;
  readonly name: string | null;
  readonly icon: Readonly<{
    type: string;
    data: string;
  } | null>;
  readonly parentTypeId: string | null;
  readonly decimalPlaces: number;
  readonly subTypeCreationPredicate: string;
  readonly tokenMintingPredicate: string;
  readonly tokenTypeOwnerPredicate: string;
}
