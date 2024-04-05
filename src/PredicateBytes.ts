import { Base16Converter } from './util/Base16Converter.js';

export class PredicateBytes {
  private readonly bytes: Uint8Array;
  public constructor(bytes: Uint8Array) {
    this.bytes = new Uint8Array(bytes);
  }

  public getBytes(): Uint8Array {
    return new Uint8Array(this.bytes);
  }

  public toString(): string {
    return `PredicateBytes[${Base16Converter.encode(this.bytes)}]`;
  }
}
