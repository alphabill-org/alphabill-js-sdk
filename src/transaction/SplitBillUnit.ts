import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';

export type SplitBillUnitArray = readonly [bigint, Uint8Array];

export class SplitBillUnit {
  public constructor(
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
  ) {}

  public toArray(): SplitBillUnitArray {
    return [this.value, this.ownerPredicate.getBytes()];
  }

  public toString(): string {
    return dedent`
      SplitBillUnit
        Value: ${this.value}
        Owner Predicate: ${this.ownerPredicate.toString()}`;
  }
}
