/**
 * @interface IPredicate
 */
export interface IPredicate {
  /**
   * Predicate bytes.
   * @type {Uint8Array}
   */
  get bytes(): Uint8Array;
}
