import { IPredicate } from './predicates/IPredicate.js';

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
   * Convert to raw CBOR.
   * @returns {readonly Uint8Array} Raw CBOR of payload state lock predicates.
   */
  encode(): Uint8Array;
}
