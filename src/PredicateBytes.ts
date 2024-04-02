import { Base16Converter } from './util/Base16Converter.js';

export class PredicateBytes {
  public constructor(private readonly bytes: Uint8Array) {}

  public getBytes(): Uint8Array {
    return new Uint8Array(this.bytes);
  }

  public toString(): string {
    return `PredicateBytes[${Base16Converter.encode(this.bytes)}]`;
  }
}
