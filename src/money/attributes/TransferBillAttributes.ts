import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Transfer bill payload attributes.
 */
export class TransferBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer bill attributes constructor.
   * @param {bigint} targetValue - Target value.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly targetValue: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly counter: bigint,
  ) {
    this.targetValue = BigInt(this.targetValue);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create TransferBillAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Transfer bill attributes as raw CBOR.
   * @returns {TransferBillAttributes} Transfer bill attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): TransferBillAttributes {
    const data = CborDecoder.readArray(rawData);
    return new TransferBillAttributes(
      CborDecoder.readUnsignedInteger(data[0]),
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
      TransferBillAttributes
        Target Value: ${this.targetValue}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeUnsignedInteger(this.targetValue),
      CborEncoder.encodeByteString(this.ownerPredicate.bytes),
      CborEncoder.encodeUnsignedInteger(this.counter),
    ]);
  }
}
