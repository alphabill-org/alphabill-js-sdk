import { CborDecoder } from '../codec/cbor/CborDecoder.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { dedent } from '../util/StringUtils.js';

/**
 * Split bill unit array.
 */
export type SplitBillUnitArray = readonly [bigint, Uint8Array];

/**
 * Split bill unit.
 */
export class SplitBillUnit {
  /**
   * Split bill unit constructor.
   * @param {bigint} value - Value.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   */
  public constructor(
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
  ) {
    this.value = BigInt(this.value);
  }

  /**
   * Create SplitBillUnit from raw CBOR.
   * @param {Uint8Array} rawData - Split bill unit as raw CBOR.
   * @returns {SplitBillUnit} Split bill unit instance.
   */
  public static fromCbor(rawData: Uint8Array): SplitBillUnit {
    const data = CborDecoder.readArray(rawData);
    return new SplitBillUnit(
      CborDecoder.readUnsignedInteger(data[0]),
      new PredicateBytes(CborDecoder.readByteString(data[1])),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      SplitBillUnit
        Value: ${this.value}
        Owner Predicate: ${this.ownerPredicate.toString()}`;
  }

  /**
   * Convert to array.
   * @returns {SplitBillUnitArray} Split bill unit array.
   */
  public encode(): SplitBillUnitArray {
    return [this.value, this.ownerPredicate.bytes];
  }
}
