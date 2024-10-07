import { PredicateBytes } from '../../PredicateBytes';
import { IStateLock } from '../IStateLock';
import { StateLock, StateLockArray } from '../StateLock';

export class StateLockSerializer {
  public static toArray({ executionPredicate, rollbackPredicate }: StateLock): StateLockArray {
    return [executionPredicate.bytes, rollbackPredicate.bytes];
  }

  public static fromArray([executionPredicate, rollbackPredicate]: StateLockArray): IStateLock {
    return new StateLock(new PredicateBytes(executionPredicate), new PredicateBytes(rollbackPredicate));
  }
}