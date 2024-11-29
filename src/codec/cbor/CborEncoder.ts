import { MajorType } from './MajorType.js';

export class CborEncoder {
  public static encodeUnsignedInteger(input: bigint | number): Uint8Array {
    if (input < 0) {
      throw new Error('Only unsigned numbers are allowed.');
    }

    if (input < 24) {
      return new Uint8Array([MajorType.UNSIGNED_INTEGER | Number(input)]);
    }

    const bytes = CborEncoder.getUnsignedIntegerAsPaddedBytes(input);

    return new Uint8Array([
      MajorType.UNSIGNED_INTEGER | CborEncoder.getAdditionalInformationBits(bytes.length),
      ...bytes,
    ]);
  }

  public static encodeByteString(input: Uint8Array): Uint8Array {
    if (input.length < 24) {
      return new Uint8Array([MajorType.BYTE_STRING | input.length, ...input]);
    }

    const lengthBytes = CborEncoder.getUnsignedIntegerAsPaddedBytes(input.length);
    return new Uint8Array([
      MajorType.BYTE_STRING | CborEncoder.getAdditionalInformationBits(lengthBytes.length),
      ...lengthBytes,
      ...input,
    ]);
  }

  public static encodeTextString(input: string): Uint8Array {
    const bytes = new TextEncoder().encode(input);
    if (bytes.length < 24) {
      return new Uint8Array([MajorType.TEXT_STRING | bytes.length, ...bytes]);
    }

    const lengthBytes = CborEncoder.getUnsignedIntegerAsPaddedBytes(bytes.length);
    return new Uint8Array([
      MajorType.TEXT_STRING | CborEncoder.getAdditionalInformationBits(lengthBytes.length),
      ...lengthBytes,
      ...bytes,
    ]);
  }

  public static encodeArray(input: Uint8Array[]): Uint8Array {
    const data = new Uint8Array(input.reduce((result, value) => result + value.length, 0));
    let length = 0;
    for (const value of input) {
      data.set(value, length);
      length += value.length;
    }

    if (input.length < 24) {
      return new Uint8Array([MajorType.ARRAY | input.length, ...data]);
    }

    const lengthBytes = CborEncoder.getUnsignedIntegerAsPaddedBytes(input.length);
    return new Uint8Array([
      MajorType.ARRAY | CborEncoder.getAdditionalInformationBits(lengthBytes.length),
      ...lengthBytes,
      ...data,
    ]);
  }

  public static encodeMap(data: Map<string, Uint8Array>): Uint8Array {
    throw new Error('Not implemented.');
  }

  public static encodeTag(tag: number | bigint, input: Uint8Array): Uint8Array {
    if (tag < 24) {
      return new Uint8Array([MajorType.TAG | Number(tag), ...input]);
    }
    const bytes = CborEncoder.getUnsignedIntegerAsPaddedBytes(tag);

    return new Uint8Array([MajorType.TAG | CborEncoder.getAdditionalInformationBits(bytes.length), ...bytes, ...input]);
  }

  public static encodeBoolean(data: boolean): Uint8Array {
    throw new Error('Not implemented');
  }

  public static encodeBitString(data: Uint8Array): Uint8Array {
    throw new Error('Not implemented');
  }

  public static encodeNull(): Uint8Array {
    return new Uint8Array([0xf6]);
  }

  private static getAdditionalInformationBits(length: number): number {
    return 24 + Math.ceil(Math.log2(length));
  }

  private static getUnsignedIntegerAsPaddedBytes(input: bigint | number): Uint8Array {
    if (input < 0) {
      throw new Error('Only unsigned numbers are allowed.');
    }

    let t: bigint;
    const bytes: number[] = [];

    for (t = BigInt(input); t > 0; t = t >> 8n) {
      bytes.push(Number(t & 255n));
    }

    if (bytes.length > 8) {
      throw new Error('Number is not unsigned long.');
    }

    if (bytes.length === 0) {
      bytes.push(0);
    }

    bytes.reverse();

    const data = new Uint8Array(Math.pow(2, Math.ceil(Math.log2(bytes.length))));
    data.set(bytes, data.length - bytes.length);

    return data;
  }
}
