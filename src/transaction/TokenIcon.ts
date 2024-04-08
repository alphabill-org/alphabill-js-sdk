import { Base16Converter } from '../util/Base16Converter.js';

export type TokenIconArray = readonly [string, Uint8Array];

export class TokenIcon {
  public constructor(
    public readonly type: string,
    private readonly _data: Uint8Array,
  ) {
    this._data = new Uint8Array(this._data);
  }

  public get data(): Uint8Array {
    return new Uint8Array(this._data);
  }

  public toArray(): TokenIconArray {
    return [this.type, this.data];
  }

  public toString(): string {
    return `TokenIcon: ${this.type}; ${Base16Converter.encode(this._data)}`;
  }

  public static fromArray(data: TokenIconArray): TokenIcon {
    return new TokenIcon(data[0], data[1]);
  }
}
