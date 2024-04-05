import { PredicateBytes } from '../PredicateBytes.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';

export type SplitBillUnitArray = readonly [bigint, Uint8Array];

export class SplitBillUnit {
  public constructor(
    private readonly value: bigint,
    private readonly ownerPredicate: IPredicate,
  ) {
    this.value = BigInt(this.value);
  }

  public getValue(): bigint {
    return this.value;
  }

  public getOwnerPredicate(): IPredicate {
    return this.ownerPredicate;
  }

  public toArray(): SplitBillUnitArray {
    return [this.getValue(), this.getOwnerPredicate().getBytes()];
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
