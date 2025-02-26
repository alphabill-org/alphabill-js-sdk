import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { INonFungibleTokenData } from '../INonFungibleTokenData.js';
import { NonFungibleTokenData } from '../NonFungibleTokenData.js';

/**
 * Create non-fungible token payload attributes.
 */
export class CreateNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'CreateNonFungibleTokenAttributes';

  /**
   * Create non-fungible token payload attributes constructor.
   * @param {IUnitId} typeId Token type ID.
   * @param {string | null} name Name.
   * @param {string | null} uri URI.
   * @param {INonFungibleTokenData | null} data Data.
   * @param {IPredicate} ownerPredicate Initial owner predicate of the new token.
   * @param {IPredicate} dataUpdatePredicate Data update predicate of the new token.
   * @param {bigint | null} nonce Optional nonce.
   */
  public constructor(
    public readonly typeId: IUnitId,
    public readonly name: string | null,
    public readonly uri: string | null,
    public readonly data: INonFungibleTokenData | null,
    public readonly ownerPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly nonce: bigint | null,
  ) {
    this.nonce = this.nonce ? BigInt(this.nonce) : null;
  }

  /**
   * Create CreateNonFungibleTokenAttributes from raw CBOR.
   * @param {Uint8Array} rawData Create non-fungible token attributes as raw CBOR.
   * @returns {CreateNonFungibleTokenAttributes} Create non-fungible token attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): CreateNonFungibleTokenAttributes {
    const data = CborDecoder.readArray(rawData);
    return new CreateNonFungibleTokenAttributes(
      UnitId.fromBytes(CborDecoder.readByteString(data[0])),
      CborDecoder.readOptional(data[1], CborDecoder.readTextString),
      CborDecoder.readOptional(data[2], CborDecoder.readTextString),
      NonFungibleTokenData.createFromBytes(CborDecoder.readByteString(data[3])),
      new PredicateBytes(CborDecoder.readByteString(data[4])),
      new PredicateBytes(CborDecoder.readByteString(data[5])),
      CborDecoder.readOptional(data[4], CborDecoder.readUnsignedInteger),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String.
   */
  public toString(): string {
    return dedent`
      CreateNonFungibleTokenAttributes
        Type ID: ${this.typeId.toString()}
        Name: ${this.name}
        URI: ${this.uri}
        Data: ${this.data?.toString() ?? 'null'}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Nonce: ${this.nonce}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(this.typeId.bytes),
      this.name ? CborEncoder.encodeTextString(this.name) : CborEncoder.encodeNull(),
      this.uri ? CborEncoder.encodeTextString(this.uri) : CborEncoder.encodeNull(),
      this.data ? CborEncoder.encodeByteString(this.data.bytes) : CborEncoder.encodeNull(),
      CborEncoder.encodeByteString(this.ownerPredicate.bytes),
      CborEncoder.encodeByteString(this.dataUpdatePredicate.bytes),
      this.nonce ? CborEncoder.encodeUnsignedInteger(this.nonce) : CborEncoder.encodeNull(),
    ]);
  }
}
