import { IPredicate } from './IPredicate.js';

export class SplitBillUnit {
  public constructor(
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
  ) {}

  public toArray(): ReadonlyArray<unknown> {
    return [this.value, this.ownerPredicate.getBytes()];
  }
}
