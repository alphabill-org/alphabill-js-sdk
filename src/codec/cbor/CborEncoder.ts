import { MajorType } from './MajorType';

export class CborEncoder {
  public static encodeUnsignedInteger(data: bigint | number): Uint8Array {
    if (data < 0) {
      throw new Error('Only unsigned numbers are allowed.');
    }

    if (data < 24) {
      return new Uint8Array([(MajorType.UNSIGNED_INTEGER << 5) | Number(data)]);
    }

    const bytes = CborEncoder.getUnsignedIntegerAsPaddedBytes(data);

    return new Uint8Array([
      (MajorType.UNSIGNED_INTEGER << 5) | CborEncoder.getAdditionalInformationBits(bytes.length),
      ...bytes,
    ]);
  }

  public static encodeBytes(input: Uint8Array): Uint8Array {
    if (input.length < 24) {
      return new Uint8Array([(MajorType.BYTE_STRING << 5) | input.length, ...input]);
    }

    const lengthBytes = CborEncoder.getUnsignedIntegerAsPaddedBytes(input.length);
    return new Uint8Array([
      (MajorType.BYTE_STRING << 5) | CborEncoder.getAdditionalInformationBits(lengthBytes.length),
      ...lengthBytes,
      ...input,
    ]);
  }

  public static encodeString(input: string): Uint8Array {
    const bytes = new TextEncoder().encode(input);
    if (bytes.length < 24) {
      return new Uint8Array([(MajorType.TEXT_STRING << 5) | bytes.length, ...bytes]);
    }

    const lengthBytes = CborEncoder.getUnsignedIntegerAsPaddedBytes(bytes.length);
    return new Uint8Array([
      (MajorType.TEXT_STRING << 5) | CborEncoder.getAdditionalInformationBits(lengthBytes.length),
      ...lengthBytes,
      ...bytes,
    ]);
  }

  public static encodeArray(input: Uint8Array[]) {
    const data = new Uint8Array(input.reduce((result, value) => result + value.length, 0));
    let length = 0;
    for (const value of input) {
      data.set(value, length);
      length += value.length;
    }

    if (input.length < 24) {
      return new Uint8Array([(MajorType.ARRAY << 5) | input.length, ...data]);
    }

    const lengthBytes = CborEncoder.getUnsignedIntegerAsPaddedBytes(input.length);
    return new Uint8Array([
      (MajorType.ARRAY << 5) | CborEncoder.getAdditionalInformationBits(lengthBytes.length),
      ...lengthBytes,
      ...data,
    ]);
  }

  public static encodeTag(tag: number | bigint, input: Uint8Array): Uint8Array {
    const value = BigInt(tag);
    if (value < 24) {
      return new Uint8Array([(MajorType.TAG << 5) | Number(value), ...input]);
    }
    const bytes = CborEncoder.getUnsignedIntegerAsPaddedBytes(value);

    return new Uint8Array([
      (MajorType.TAG << 5) | CborEncoder.getAdditionalInformationBits(bytes.length),
      ...bytes,
      ...input,
    ]);
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
