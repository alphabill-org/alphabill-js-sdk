import { IPredicate } from './predicate/IPredicate.js';
import { StateLockArray } from './StateLock.js';

/**
 * Transaction payload state lock.
 * @interface IStateLock
 */
export interface IStateLock {
  /**
   * Predicate for executing state locked Tx.
   * @type {IPredicate}
   */
  readonly executionPredicate: IPredicate;

  /**
   * Predicate for discarding state locked Tx.
   * @type {IPredicate}
   */
  readonly rollbackPredicate: IPredicate;

  /**
   * Convert to array.
   * @returns {readonly Uint8Array[]} Array of payload state lock predicates.
   */
  encode(): StateLockArray;
}
