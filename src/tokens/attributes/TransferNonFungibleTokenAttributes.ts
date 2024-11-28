import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Transfer non-fungible token attributes array.
 */
export type TransferNonFungibleTokenAttributesArray = readonly [
  Uint8Array, // Type ID
  Uint8Array, // Owner Predicate
  bigint, // Counter
];

/**
 * Transfer non-fungible token payload attributes.
 */
export class TransferNonFungibleTokenAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer non-fungible token attributes constructor.
   * @param {IUnitId} typeId - Type ID.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly typeId: IUnitId,
    public readonly ownerPredicate: IPredicate,
    public readonly counter: bigint,
  ) {
    this.counter = BigInt(this.counter);
  }

  /**
   * Create a TransferNonFungibleTokenAttributes from raw CBOR.
   * @param {Uint8Array} rawData - transfer non-fungible token attributes as raw CBOR.
   * @returns {TransferNonFungibleTokenAttributes} Transfer non-fungible token attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): TransferNonFungibleTokenAttributes {
    const data = CborDecoder.readArray(rawData);
    return new TransferNonFungibleTokenAttributes(
      UnitId.fromBytes(CborDecoder.readByteString(data[0])),
      new PredicateBytes(CborDecoder.readByteString(data[1])),
      CborDecoder.readUnsignedInteger(data[2]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferNonFungibleTokenAttributes
        Type ID: ${this.typeId.toString()}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<TransferNonFungibleTokenAttributesArray> {
    return Promise.resolve([this.typeId.bytes, this.ownerPredicate.bytes, this.counter]);
  }
}
