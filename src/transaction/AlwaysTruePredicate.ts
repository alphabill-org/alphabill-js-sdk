import { IPredicate } from './IPredicate.js';

/**
 * Always true predicate.
 */
export class AlwaysTruePredicate implements IPredicate {
  /**
   * @see {IPredicate.bytes}
   */
  public get bytes(): Uint8Array {
    return new Uint8Array([0x83, 0x00, 0x41, 0x01, 0xf6]);
  }

  /**
   * Always true predicate to string.
   * @returns {string} Always true predicate to string.
   */
  public toString(): string {
    return 'AlwaysTruePredicate';
  }
}
