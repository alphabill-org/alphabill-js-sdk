import { IUnitId } from '../../IUnitId.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { PredicateBytes } from '../predicate/PredicateBytes.js';
import { TokenIcon, TokenIconArray } from '../TokenIcon.js';

/**
 * Create non-fungible token type attributes array.
 */
export type CreateNonFungibleTokenTypeAttributesArray = readonly [
  string, // Symbol
  string, // Name
  TokenIconArray, // Icon
  Uint8Array | null, // Parent Type ID
  Uint8Array, // SubType Creation Predicate
  Uint8Array, // Token Creation Predicate
  Uint8Array, // Token Type Owner Predicate
  Uint8Array, // Data Update Predicate
];

/**
 * Create non-fungible token type payload attributes.
 */
export class CreateNonFungibleTokenTypeAttributes implements ITransactionPayloadAttributes {
  /**
   * Create non-fungible token type payload attributes constructor.
   * @param {string} symbol Symbol.
   * @param {string} name Name.
   * @param {TokenIcon} icon Icon.
   * @param {IUnitId | null} parentTypeId Parent type ID.
   * @param {IPredicate} subTypeCreationPredicate Predicate clause that controls defining new subtypes of this type.
   * @param {IPredicate} tokenCreationPredicate Predicate clause that controls minting new tokens of this type.
   * @param {IPredicate} tokenTypeOwnerPredicate Predicate clause that all tokens of this type (and of subtypes of this type) inherit into their owner predicates.
   * @param {IPredicate} dataUpdatePredicate Predicate clause that all tokens of this type (and of subtypes of this type) inherit into their data update predicates.
   */
  public constructor(
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenCreationPredicate: IPredicate,
    public readonly tokenTypeOwnerPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
  ) {}

  /**
   * Create CreateNonFungibleTokenTypeAttributes from array.
   * @param {CreateNonFungibleTokenTypeAttributesArray} data Create non-fungible token type attributes array.
   * @returns {CreateNonFungibleTokenTypeAttributes} Create non-fungible token type attributes instance.
   */
  public static fromArray([
    symbol,
    name,
    icon,
    parentTypeId,
    subTypeCreationPredicate,
    tokenCreationPredicate,
    tokenTypeOwnerPredicate,
    dataUpdatePredicate,
  ]: CreateNonFungibleTokenTypeAttributesArray): CreateNonFungibleTokenTypeAttributes {
    return new CreateNonFungibleTokenTypeAttributes(
      symbol,
      name,
      TokenIcon.fromArray(icon),
      parentTypeId ? UnitId.fromBytes(parentTypeId) : null,
      new PredicateBytes(subTypeCreationPredicate),
      new PredicateBytes(tokenCreationPredicate),
      new PredicateBytes(tokenTypeOwnerPredicate),
      new PredicateBytes(dataUpdatePredicate),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      CreateNonFungibleTokenTypeAttributes
        Symbol: ${this.symbol}
        Name: ${this.name}
        Icon: ${this.icon.toString()}
        Parent Type ID: ${this.parentTypeId?.toString() ?? 'null'}
        Sub Type Creation Predicate: ${this.subTypeCreationPredicate.toString()}
        Token Creation Predicate: ${this.tokenCreationPredicate.toString()}
        Token Type Owner Predicate: ${this.tokenTypeOwnerPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<CreateNonFungibleTokenTypeAttributesArray> {
    return Promise.resolve([
      this.symbol,
      this.name,
      this.icon.encode(),
      this.parentTypeId?.bytes || null,
      this.subTypeCreationPredicate.bytes,
      this.tokenCreationPredicate.bytes,
      this.tokenTypeOwnerPredicate.bytes,
      this.dataUpdatePredicate.bytes,
    ]);
  }
}
