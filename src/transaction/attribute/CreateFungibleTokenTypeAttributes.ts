import { IUnitId } from '../../IUnitId.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TokenIcon, TokenIconArray } from '../TokenIcon.js';

/**
 * Create fungible token type attributes array.
 */
export type CreateFungibleTokenTypeAttributesArray = readonly [
  string, // Symbol
  string, // Name
  TokenIconArray, // Icon
  Uint8Array | null, // Parent Type ID
  number, // Decimal places
  Uint8Array, // SubType Creation Predicate
  Uint8Array, // Token creation predicate
  Uint8Array, // Token type owner predicate
];

/**
 * Create fungible token type payload attributes.
 */
export class CreateFungibleTokenTypeAttributes implements ITransactionPayloadAttributes {
  /**
   * Create fungible token type payload attributes constructor.
   * @param {string} symbol Symbol.
   * @param {string} name Name.
   * @param {TokenIcon} icon Icon.
   * @param {IUnitId | null} parentTypeId Parent type ID.
   * @param {number} decimalPlaces Decimal places.
   * @param {IPredicate} subTypeCreationPredicate Predicate clause that controls defining new subtypes of this type.
   * @param {IPredicate} tokenCreationPredicate Predicate clause that controls minting new tokens of this type.
   * @param {IPredicate} tokenTypeOwnerPredicate Predicate clause that all tokens of this type (and of subtypes of this type) inherit into their owner predicates.
   */
  public constructor(
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly decimalPlaces: number,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenCreationPredicate: IPredicate,
    public readonly tokenTypeOwnerPredicate: IPredicate,
  ) {}

  /**
   * Convert to string.
   * @returns {string} String.
   */
  public toString(): string {
    return dedent`
      CreateFungibleTokenTypeAttributes
        Symbol: ${this.symbol}
        Name: ${this.name}
        Icon: ${this.icon.toString()}
        Parent Type ID: ${this.parentTypeId?.toString() ?? 'null'}
        Decimal Places: ${this.decimalPlaces}
        Sub Type Creation Predicate: ${this.subTypeCreationPredicate.toString()}
        Token Creation Predicate: ${this.tokenCreationPredicate.toString()}
        Token Type Owner Predicate: ${this.tokenTypeOwnerPredicate.toString()}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<CreateFungibleTokenTypeAttributesArray> {
    return Promise.resolve([
      this.symbol,
      this.name,
      this.icon.encode(),
      this.parentTypeId?.bytes || null,
      this.decimalPlaces,
      this.subTypeCreationPredicate.bytes,
      this.tokenCreationPredicate.bytes,
      this.tokenTypeOwnerPredicate.bytes,
    ]);
  }

  /**
   * Create CreateFungibleTokenTypeAttributes from array.
   * @param {CreateFungibleTokenTypeAttributesArray} data Create fungible token type attributes array.
   * @returns {CreateFungibleTokenTypeAttributes} Create fungible token type attributes instance.
   */
  public static fromArray([
    symbol,
    name,
    icon,
    parentTypeId,
    decimalPlaces,
    subTypeCreationPredicate,
    tokenCreationPredicate,
    tokenTypeOwnerPredicate,
  ]: CreateFungibleTokenTypeAttributesArray): CreateFungibleTokenTypeAttributes {
    return new CreateFungibleTokenTypeAttributes(
      symbol,
      name,
      TokenIcon.fromArray(icon),
      parentTypeId ? UnitId.fromBytes(parentTypeId) : null,
      decimalPlaces,
      new PredicateBytes(subTypeCreationPredicate),
      new PredicateBytes(tokenCreationPredicate),
      new PredicateBytes(tokenTypeOwnerPredicate),
    );
  }
}
