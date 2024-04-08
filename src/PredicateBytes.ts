import { IPredicate } from './transaction/IPredicate.js';
import { Base16Converter } from './util/Base16Converter.js';

export class PredicateBytes implements IPredicate {
  private readonly _bytes: Uint8Array;
  public constructor(bytes: Uint8Array) {
    this._bytes = new Uint8Array(bytes);
  }

  public get bytes(): Uint8Array {
    return new Uint8Array(this._bytes);
  }

  public toString(): string {
    return `PredicateBytes[${Base16Converter.encode(this._bytes)}]`;
  }
}
