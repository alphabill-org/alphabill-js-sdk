import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Transfer fungible token attributes array.
 */
export type TransferFungibleTokenAttributesArray = readonly [
  Uint8Array, // Type ID
  bigint, // Value
  Uint8Array, // Owner Predicate
  bigint, // Counter
];

/**
 * Transfer fungible token payload attributes.
 */
export class TransferFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer fungible token attributes constructor.
   * @param {IUnitId} typeId - Type ID.
   * @param {bigint} value - Value.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly counter: bigint,
  ) {
    this.value = BigInt(this.value);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create TransferFungibleTokenAttributesArray from raw CBOR.
   * @param {TransferFungibleTokenAttributesArray} rawData - Transfer fungible token attributes as raw CBOR.
   * @returns {TransferFungibleTokenAttributes} Transfer fungible token attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): TransferFungibleTokenAttributes {
    const data = CborDecoder.readArray(rawData);
    return new TransferFungibleTokenAttributes(
      UnitId.fromBytes(CborDecoder.readByteString(data[0])),
      CborDecoder.readUnsignedInteger(data[1]),
      new PredicateBytes(CborDecoder.readByteString(data[2])),
      CborDecoder.readUnsignedInteger(data[3]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferFungibleTokenAttributes
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<TransferFungibleTokenAttributesArray> {
    return Promise.resolve([this.typeId.bytes, this.value, this.ownerPredicate.bytes, this.counter]);
  }
}
