import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Set fee credit payload attributes.
 */
export class SetFeeCreditAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'SetFeeCreditAttributes';

  /**
   * Set fee credit payload attributes constructor.
   * @param {IPredicate} ownerPredicate Owner predicate to be set to the fee credit record
   * @param {Uint8Array} amount Fee credit amount to be added
   * @param {bigint} counter Transaction counter of the target fee credit record, or nil if the record does not exist yet
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly amount: bigint,
    public readonly counter: bigint | null,
  ) {
    this.amount = BigInt(this.amount);
    this.counter = this.counter != null ? BigInt(this.counter) : null;
  }

  /**
   * Create SetFeeCreditAttributes from raw CBOR.
   * @param {Uint8Array} rawData Set fee credit attributes as raw CBOR.
   * @returns {SetFeeCreditAttributes} Set fee credit attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): SetFeeCreditAttributes {
    const data = CborDecoder.readArray(rawData);
    return new SetFeeCreditAttributes(
      new PredicateBytes(CborDecoder.readByteString(data[0])),
      CborDecoder.readUnsignedInteger(data[1]),
      CborDecoder.readOptional(data[2], CborDecoder.readUnsignedInteger),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      SetFeeCreditAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Amount: ${this.amount}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(this.ownerPredicate.bytes),
      CborEncoder.encodeUnsignedInteger(this.amount),
      this.counter != null ? CborEncoder.encodeUnsignedInteger(this.counter) : CborEncoder.encodeNull(),
    ]);
  }
}
