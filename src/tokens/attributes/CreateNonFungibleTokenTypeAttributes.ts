import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { TokenIcon } from '../TokenIcon.js';

/**
 * Create non-fungible token type payload attributes.
 */
export class CreateNonFungibleTokenTypeAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'CreateNonFungibleTokenTypeAttributes';

  /**
   * Create non-fungible token type payload attributes constructor.
   * @param {string} symbol Symbol.
   * @param {string | null} name Name.
   * @param {TokenIcon | null} icon Icon.
   * @param {IUnitId | null} parentTypeId Parent type ID.
   * @param {IPredicate} subTypeCreationPredicate Predicate clause that controls defining new subtypes of this type.
   * @param {IPredicate} tokenMintingPredicate Predicate clause that controls minting new tokens of this type.
   * @param {IPredicate} tokenTypeOwnerPredicate Predicate clause that all tokens of this type (and of subtypes of this type) inherit into their owner predicates.
   * @param {IPredicate} dataUpdatePredicate Predicate clause that all tokens of this type (and of subtypes of this type) inherit into their data update predicates.
   */
  public constructor(
    public readonly symbol: string,
    public readonly name: string | null,
    public readonly icon: TokenIcon | null,
    public readonly parentTypeId: IUnitId | null,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenMintingPredicate: IPredicate,
    public readonly tokenTypeOwnerPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
  ) {}

  /**
   * Create CreateNonFungibleTokenTypeAttributes from raw CBOR.
   * @param {Uint8Array} rawData Create non-fungible token type attributes as raw CBOR.
   * @returns {CreateNonFungibleTokenTypeAttributes} Create non-fungible token type attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): CreateNonFungibleTokenTypeAttributes {
    const data = CborDecoder.readArray(rawData);
    return new CreateNonFungibleTokenTypeAttributes(
      CborDecoder.readTextString(data[0]),
      CborDecoder.readOptional(data[1], CborDecoder.readTextString),
      CborDecoder.readOptional(data[2], TokenIcon.fromCbor),
      CborDecoder.readOptional(data[3], UnitId.fromCbor),
      new PredicateBytes(CborDecoder.readByteString(data[4])),
      new PredicateBytes(CborDecoder.readByteString(data[5])),
      new PredicateBytes(CborDecoder.readByteString(data[6])),
      new PredicateBytes(CborDecoder.readByteString(data[7])),
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
        Icon: ${this.icon?.toString() ?? 'null'}
        Parent Type ID: ${this.parentTypeId?.toString() ?? 'null'}
        Sub Type Creation Predicate: ${this.subTypeCreationPredicate.toString()}
        Token Minting Predicate: ${this.tokenMintingPredicate.toString()}
        Token Type Owner Predicate: ${this.tokenTypeOwnerPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeTextString(this.symbol),
      this.name ? CborEncoder.encodeTextString(this.name) : CborEncoder.encodeNull(),
      this.icon?.encode() ?? CborEncoder.encodeNull(),
      this.parentTypeId ? CborEncoder.encodeByteString(this.parentTypeId.bytes) : CborEncoder.encodeNull(),
      CborEncoder.encodeByteString(this.subTypeCreationPredicate.bytes),
      CborEncoder.encodeByteString(this.tokenMintingPredicate.bytes),
      CborEncoder.encodeByteString(this.tokenTypeOwnerPredicate.bytes),
      CborEncoder.encodeByteString(this.dataUpdatePredicate.bytes),
    ]);
  }
}
