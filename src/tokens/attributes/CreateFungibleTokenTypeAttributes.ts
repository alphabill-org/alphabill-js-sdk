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
   * @param {IPredicate} tokenMintingPredicate Predicate clause that controls minting new tokens of this type.
   * @param {IPredicate} tokenTypeOwnerPredicate Predicate clause that all tokens of this type (and of subtypes of this type) inherit into their owner predicates.
   */
  public constructor(
    public readonly symbol: string,
    public readonly name: string,
    public readonly icon: TokenIcon,
    public readonly parentTypeId: IUnitId | null,
    public readonly decimalPlaces: number,
    public readonly subTypeCreationPredicate: IPredicate,
    public readonly tokenMintingPredicate: IPredicate,
    public readonly tokenTypeOwnerPredicate: IPredicate,
  ) {}

  /**
   * Create CreateFungibleTokenTypeAttributes from raw CBOR.
   * @param {Uint8Array} rawData Create fungible token type attributes as raw CBOR.
   * @returns {CreateFungibleTokenTypeAttributes} Create fungible token type attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): CreateFungibleTokenTypeAttributes {
    const data = CborDecoder.readArray(rawData);
    return new CreateFungibleTokenTypeAttributes(
      CborDecoder.readTextString(data[0]),
      CborDecoder.readTextString(data[1]),
      TokenIcon.fromCbor(data[2]),
      CborDecoder.readOptional(data[3], UnitId.fromCbor),
      Number(CborDecoder.readUnsignedInteger(data[4])),
      new PredicateBytes(CborDecoder.readByteString(data[5])),
      new PredicateBytes(CborDecoder.readByteString(data[6])),
      new PredicateBytes(CborDecoder.readByteString(data[7])),
    );
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
        Token Minting Predicate: ${this.tokenMintingPredicate.toString()}
        Token Type Owner Predicate: ${this.tokenTypeOwnerPredicate.toString()}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeTextString(this.symbol),
      CborEncoder.encodeTextString(this.name),
      this.icon.encode(),
      this.parentTypeId ? CborEncoder.encodeByteString(this.parentTypeId.bytes) : CborEncoder.encodeNull(),
      CborEncoder.encodeUnsignedInteger(this.decimalPlaces),
      CborEncoder.encodeByteString(this.subTypeCreationPredicate.bytes),
      CborEncoder.encodeByteString(this.tokenMintingPredicate.bytes),
      CborEncoder.encodeByteString(this.tokenTypeOwnerPredicate.bytes),
    ]);
  }
}
