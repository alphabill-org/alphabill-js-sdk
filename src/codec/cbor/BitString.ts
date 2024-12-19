import { CborError } from './CborError.js';

export class BitString {
  public constructor(
    private readonly _bits: Uint8Array,
    public readonly length: number,
  ) {}

  public get bits(): Uint8Array {
    return new Uint8Array(this._bits);
  }

  public static create(data: Uint8Array): BitString {
    let lastByte = data.at(-1);
    if (lastByte === undefined) {
      throw new CborError('Invalid bit string encoding: empty input');
    }

    for (let i = 8; i > 0; i--) {
      if ((lastByte & 1) === 1) {
        if (i === 1) {
          return new BitString(data.subarray(0, data.length - 1), (data.length - 1) * 8);
        }

        return new BitString(
          new Uint8Array([...data.subarray(0, data.length - 1), (lastByte >> 1) << (8 - i + 1)]),
          (data.length - 1) * 8 + i - 1,
        );
      }

      lastByte >>= 1;
    }

    throw new CborError('Invalid bit string encoding: last byte doesnt contain end marker');
  }

  public getBitFromEnd(index: number): number {
    const byte = this._bits.at(Math.floor(index / 8));
    if (!byte) {
      throw new Error('Index out of bounds');
    }

    return (byte & (1 << index % 8)) > 0 ? 1 : 0;
  }

  public encode(): Uint8Array {
    const byteCount = Math.floor(this.length / 8);
    const bitCount = this.length % 8;
    const result = new Uint8Array(byteCount + 1);
    result.set(this._bits.subarray(0, byteCount));
    if (bitCount == 0) {
      result[byteCount] = 0b10000000;
    } else {
      // clear trailing bits
      const v = this._bits[byteCount] & ~(0xff >> bitCount);
      // add end marker
      result[byteCount] = v | (1 << (7 - bitCount));
    }
    return result;
  }

  public toString(): string {
    let result = '';
    for (let i = 0; i < this._bits.length; i++) {
      result += this._bits[i].toString(2);
    }

    return result;
  }
}
