import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Split fungible token payload attributes.
 */
export class SplitFungibleTokenAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'SplitFungibleTokenAttributes';

  /**
   * Split fungible token attributes constructor.
   * @param {IUnitId} typeId - Type ID.
   * @param {bigint} targetValue - Target value.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly typeId: IUnitId,
    public readonly targetValue: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly counter: bigint,
  ) {
    this.targetValue = BigInt(this.targetValue);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create a SplitFungibleTokenAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Split fungible token attributes as raw CBOR.
   * @returns {SplitFungibleTokenAttributes} Split fungible token attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): SplitFungibleTokenAttributes {
    const data = CborDecoder.readArray(rawData);
    return new SplitFungibleTokenAttributes(
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
      SplitFungibleTokenAttributes
        Type ID: ${this.typeId.toString()}
        Target Value: ${this.targetValue}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(this.typeId.bytes),
      CborEncoder.encodeUnsignedInteger(this.targetValue),
      CborEncoder.encodeByteString(this.ownerPredicate.bytes),
      CborEncoder.encodeUnsignedInteger(this.counter),
    ]);
  }
}
