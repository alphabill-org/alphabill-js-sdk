import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Create fungible token payload attributes.
 */
export class CreateFungibleTokenAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'CreateFungibleTokenAttributes';

  /**
   * Create fungible token payload attributes constructor.
   * @param {IPredicate} ownerPredicate Initial owner predicate of the new token.
   * @param {IUnitId} typeId Token type ID.
   * @param {bigint} value Token value.
   * @param {bigint | null} nonce Optional nonce.
   */
  public constructor(
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly nonce: bigint | null,
  ) {
    this.value = BigInt(this.value);
    this.nonce = this.nonce ? BigInt(this.nonce) : null;
  }

  /**
   * Create CreateFungibleTokenAttributes from raw CBOR.
   * @param {Uint8Array} rawData Create fungible token attributes as raw CBOR.
   * @returns {CreateFungibleTokenAttributes} Create fungible token attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): CreateFungibleTokenAttributes {
    const data = CborDecoder.readArray(rawData);
    return new CreateFungibleTokenAttributes(
      UnitId.fromBytes(CborDecoder.readByteString(data[0])),
      CborDecoder.readUnsignedInteger(data[1]),
      new PredicateBytes(CborDecoder.readByteString(data[2])),
      CborDecoder.readOptional(data[3], CborDecoder.readUnsignedInteger),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      CreateFungibleTokenAttributes
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Nonce: ${this.nonce}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(this.typeId.bytes),
      CborEncoder.encodeUnsignedInteger(this.value),
      CborEncoder.encodeByteString(this.ownerPredicate.bytes),
      this.nonce ? CborEncoder.encodeUnsignedInteger(this.nonce) : CborEncoder.encodeNull(),
    ]);
  }
}
