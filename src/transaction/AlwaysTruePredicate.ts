import { IPredicate } from './IPredicate.js';

export class AlwaysTruePredicate implements IPredicate {
  public getBytes(): Uint8Array {
    return new Uint8Array([0x83, 0x00, 0x41, 0x01, 0xf6]);
  }
}
