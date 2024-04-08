import { PredicateBytes } from '../PredicateBytes.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';

export type SplitBillUnitArray = readonly [bigint, Uint8Array];

export class SplitBillUnit {
  public constructor(
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
  ) {
    this.value = BigInt(this.value);
  }

  public toArray(): SplitBillUnitArray {
    return [this.value, this.ownerPredicate.bytes];
  }

  public toString(): string {
    return dedent`
      SplitBillUnit
        Value: ${this.value}
        Owner Predicate: ${this.ownerPredicate.toString()}`;
  }

  public static fromArray(data: SplitBillUnitArray): SplitBillUnit {
    return new SplitBillUnit(data[0], new PredicateBytes(data[1]));
  }
}
