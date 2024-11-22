import { BitMask } from './BitMask.js';
import { MajorType } from './MajorType.js';

export class CborDecoder {
  public static decodeUnsignedInteger(input: Uint8Array, offset: number): bigint {
    const initialByte = input[offset];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.UNSIGNED_INTEGER) {
      throw new Error('Major type mismatch, expected unsigned integer');
    }
    const additionalInformation = initialByte & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      return BigInt(additionalInformation);
    }
    if (additionalInformation > 27) {
      throw new Error('Encoded item is not well-formed');
    }
    const numberOfLengthBytes = Math.pow(2, additionalInformation - 24);
    return this.decodeUint(input, offset + 1, numberOfLengthBytes);
  }

  public static decodeNegativeInteger(): bigint {
    throw new Error('Not implemented.');
  }

  public static decodeByteString(input: Uint8Array, offset: number): Uint8Array {
    const initialByte = input[offset];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.BYTE_STRING) {
      throw new Error('Major type mismatch, expected byte string');
    }
    const additionalInformation = initialByte & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      return input.subarray(offset + 1, offset + 1 + additionalInformation);
    }
    if (additionalInformation > 27) {
      throw new Error('Encoded item is not well-formed');
    }
    const numberOfLengthBytes = Math.pow(2, additionalInformation - 24);
    const textLength = this.decodeUint(input, offset + 1, numberOfLengthBytes);
    const byteStringStart = offset + 1 + numberOfLengthBytes;
    const byteStringEnd = byteStringStart + Number(textLength);
    return input.subarray(byteStringStart, byteStringEnd);
  }

  public static decodeTextString(input: Uint8Array, offset: number): string {
    const initialByte = input[offset];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.TEXT_STRING) {
      throw new Error('Major type mismatch, expected text string');
    }
    const additionalInformation = initialByte & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      return new TextDecoder().decode(input.subarray(offset + 1, offset + 1 + additionalInformation));
    }
    if (additionalInformation > 27) {
      throw new Error('Encoded item is not well-formed');
    }
    const numberOfLengthBytes = Math.pow(2, additionalInformation - 24);
    const textLength = this.decodeUint(input, offset + 1, numberOfLengthBytes);
    const textStringStart = offset + 1 + numberOfLengthBytes;
    const textStringEnd = textStringStart + Number(textLength);
    const textStringBytes = input.subarray(textStringStart, textStringEnd);
    return new TextDecoder().decode(textStringBytes);
  }

  public static decodeArray(input: Uint8Array, offset: number): Uint8Array[] {
    throw new Error('Todo');
  }

  public static decodeTag(tag: number | bigint, input: Uint8Array, offset: number): Uint8Array {
    throw new Error('Todo');
  }

  private static decodeUint(input: Uint8Array, offset: number, length: number): bigint {
    if (offset < 0 || length < 0 || offset + length > input.length) {
      throw new Error('Index out of bounds');
    }

    let t = BigInt(0);
    for (let i = 0; i < length; ++i) {
      t = (t << 8n) | BigInt(input[offset + i]);
    }

    return t;
  }
}
