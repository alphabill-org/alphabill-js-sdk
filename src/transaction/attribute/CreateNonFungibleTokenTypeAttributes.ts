import { IUnitId } from '../../IUnitId.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TokenIcon, TokenIconArray } from '../TokenIcon.js';
import { TransactionOrderType } from '../TransactionOrderType';

/**
 * Create non-fungible token type attributes array.
 */
export type CreateNonFungibleTokenTypeAttributesArray = readonly [
  string,
  string,
  TokenIconArray,
  Uint8Array | null,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
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
   * @param {IPredicate} subTypeCreationPredicate Sub type creation predicate.
   * @param {IPredicate} tokenCreationPredicate Token creation predicate.
   * @param {IPredicate} invariantPredicate Invariant predicate.
   * @param {IPredicate} dataUpdatePredicate Data update predicate.
   * @param {Uint8Array[] | null} _subTypeCreationPredicateSignatures Sub type creation predicate signatures.
   */
  public constructor(
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenCreationPredicate: IPredicate,
    public readonly invariantPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
    private readonly _subTypeCreationPredicateSignatures: Uint8Array[] | null,
  ) {
    this._subTypeCreationPredicateSignatures =
      this._subTypeCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): TransactionOrderType {
    return TransactionOrderType.CreateNonFungibleTokenType;
  }

  /**
   * Get sub type creation predicate signatures.
   * @returns {Uint8Array[] | null}
   */
  public get subTypeCreationPredicateSignatures(): Uint8Array[] | null {
    return this._subTypeCreationPredicateSignatures?.map((signature) => new Uint8Array(signature)) || null;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): CreateNonFungibleTokenTypeAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): CreateNonFungibleTokenTypeAttributesArray {
    return [
      this.symbol,
      this.name,
      this.icon.toArray(),
      this.parentTypeId?.bytes || null,
      this.subTypeCreationPredicate.bytes,
      this.tokenCreationPredicate.bytes,
      this.invariantPredicate.bytes,
      this.dataUpdatePredicate.bytes,
      this.subTypeCreationPredicateSignatures,
    ];
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
        Invariant Predicate: ${this.invariantPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Sub Type Creation Predicate Signatures: ${
          this._subTypeCreationPredicateSignatures
            ? dedent`
        [
          ${this._subTypeCreationPredicateSignatures.map((signature) => Base16Converter.encode(signature)).join(',\n')}
        ]`
            : 'null'
        }`;
  }

  /**
   * Create CreateNonFungibleTokenTypeAttributes from array.
   * @param {CreateNonFungibleTokenTypeAttributesArray} data Create non-fungible token type attributes array.
   * @returns {CreateNonFungibleTokenTypeAttributes} Create non-fungible token type attributes instance.
   */
  public static fromArray(data: CreateNonFungibleTokenTypeAttributesArray): CreateNonFungibleTokenTypeAttributes {
    return new CreateNonFungibleTokenTypeAttributes(
      data[0],
      data[1],
      TokenIcon.fromArray(data[2]),
      data[3] ? UnitId.fromBytes(data[3]) : null,
      new PredicateBytes(data[4]),
      new PredicateBytes(data[5]),
      new PredicateBytes(data[6]),
      new PredicateBytes(data[7]),
      data[8],
    );
  }
}
