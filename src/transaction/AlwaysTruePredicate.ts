import { IPredicate } from './IPredicate.js';

export class AlwaysTruePredicate implements IPredicate {
  public get bytes(): Uint8Array {
    return new Uint8Array([0x83, 0x00, 0x41, 0x01, 0xf6]);
  }

  public toString(): string {
    return 'AlwaysTruePredicate';
  }
}
