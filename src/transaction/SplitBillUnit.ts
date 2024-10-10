import { PredicateBytes } from '../PredicateBytes.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';

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

  /**
   * Create SplitBillUnit from array.
   * @param {SplitBillUnitArray} data - Split bill unit array.
   * @returns {SplitBillUnit} Split bill unit instance.
   */
  public static fromArray([value, ownerPredicate]: SplitBillUnitArray): SplitBillUnit {
    return new SplitBillUnit(value, new PredicateBytes(ownerPredicate));
  }
}
