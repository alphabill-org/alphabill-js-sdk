import { IUnitId } from '../IUnitId.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';
import { TokenIcon, TokenIconArray } from './TokenIcon.js';

/**
 * Create fungible token type attributes array.
 */
export type CreateFungibleTokenTypeAttributesArray = readonly [
  string,
  string,
  TokenIconArray,
  Uint8Array | null,
  number,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array,
  Uint8Array[] | null,
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
    public readonly decimalPlaces: number,
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
  public get payloadType(): PayloadType {
    return PayloadType.CreateFungibleTokenTypeAttributes;
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
  public toOwnerProofData(): CreateFungibleTokenTypeAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): CreateFungibleTokenTypeAttributesArray {
    return [
      this.symbol,
      this.name,
      this.icon.toArray(),
      this.parentTypeId?.bytes || null,
      this.decimalPlaces,
      this.subTypeCreationPredicate.bytes,
      this.tokenCreationPredicate.bytes,
      this.invariantPredicate.bytes,
      this.dataUpdatePredicate.bytes,
      this.subTypeCreationPredicateSignatures,
    ];
  }

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
   * Create CreateFungibleTokenTypeAttributes from array.
   * @param {CreateFungibleTokenTypeAttributesArray} data Create fungible token type attributes array.
   * @returns {CreateFungibleTokenTypeAttributes} Create fungible token type attributes instance.
   */
  public static fromArray(data: CreateFungibleTokenTypeAttributesArray): CreateFungibleTokenTypeAttributes {
    return new CreateFungibleTokenTypeAttributes(
      data[0],
      data[1],
      TokenIcon.fromArray(data[2]),
      data[3] ? UnitId.fromBytes(data[3]) : null,
      data[4],
      new PredicateBytes(data[5]),
      new PredicateBytes(data[6]),
      new PredicateBytes(data[7]),
      new PredicateBytes(data[8]),
      data[9],
    );
  }
}
