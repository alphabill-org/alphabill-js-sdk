import { Base16Converter } from '../util/Base16Converter.js';

export type TokenIconArray = readonly [string, Uint8Array];

export class TokenIcon {
  public constructor(
    private readonly type: string,
    private readonly data: Uint8Array,
  ) {
    this.data = new Uint8Array(this.data);
  }

  public getType(): string {
    return this.type;
  }

  public getData(): Uint8Array {
    return new Uint8Array(this.data);
  }

  public toArray(): TokenIconArray {
    return [this.getType(), this.getData()];
  }

  public toString(): string {
    return `TokenIcon: ${this.type}; ${Base16Converter.encode(this.data)}`;
  }

  public static fromArray(data: TokenIconArray): TokenIcon {
    return new TokenIcon(data[0], data[1]);
  }
}
