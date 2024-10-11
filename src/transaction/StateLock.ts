import { IStateLock } from './IStateLock.js';
import { IPredicate } from './predicate/IPredicate.js';
import { PredicateBytes } from './predicate/PredicateBytes.js';

export type StateLockArray = [Uint8Array, Uint8Array];

export class StateLock implements IStateLock {
  public constructor(
    public readonly executionPredicate: IPredicate,
    public readonly rollbackPredicate: IPredicate,
  ) {}

  public encode(): StateLockArray {
    return [this.executionPredicate.bytes, this.rollbackPredicate.bytes];
  }

  public static fromArray([executionPredicate, rollbackPredicate]: StateLockArray): StateLock {
    return new StateLock(new PredicateBytes(executionPredicate), new PredicateBytes(rollbackPredicate));
  }
}
