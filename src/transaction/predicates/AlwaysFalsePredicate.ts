import { IPredicate } from './IPredicate.js';

/**
 * Always false predicate.
 */
export class AlwaysFalsePredicate implements IPredicate {
  /**
   * @see {IPredicate.bytes}
   */
  public get bytes(): Uint8Array {
    return new Uint8Array([0x83, 0x00, 0x41, 0x00, 0xf6]);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return 'AlwaysFalsePredicate';
  }
}
