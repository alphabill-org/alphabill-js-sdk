import { IPredicate } from './IPredicate.js';
import { IStateLock } from './IStateLock.js';

export type StateLockArray = [Uint8Array, Uint8Array];

export class StateLock implements IStateLock {
  public constructor(
    public readonly executionPredicate: IPredicate,
    public readonly rollbackPredicate: IPredicate,
  ) {}

  public toArray(): StateLockArray {
    return [this.executionPredicate.bytes, this.rollbackPredicate.bytes];
  }
}
