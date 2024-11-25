import { BitMask } from './BitMask.js';
import { MajorType } from './MajorType.js';

export class CborDecoder {
  private readonly data: Uint8Array;
  private position: number = 0;

  public constructor(data: Uint8Array) {
    this.data = new Uint8Array(data);
  }

  public decodeUnknownCbor(): unknown {
    const majorType = this.data[this.position] & BitMask.MAJOR_TYPE;
    switch (majorType) {
      case MajorType.UNSIGNED_INTEGER:
        return this.decodeUnsignedInteger();
      case MajorType.NEGATIVE_INTEGER:
        throw new Error('Decoding negative integers not supported.');
      case MajorType.BYTE_STRING:
        return this.decodeByteString();
      case MajorType.TEXT_STRING:
        return this.decodeTextString();
      case MajorType.ARRAY:
        return this.decodeArray();
      case MajorType.MAP:
        throw new Error('Decoding map not supported.');
      case MajorType.TAG:
        return this.decodeTag();
      case MajorType.FLOAT_SIMPLE_BREAK:
        throw new Error('Decoding float, simple value or break not supported.');
      default:
        throw new Error('Unknown major type.');
    }
  }

  public decodeUnsignedInteger(): bigint {
    const initialByte = this.data[this.position++];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.UNSIGNED_INTEGER) {
      throw new Error('Major type mismatch, expected unsigned integer.');
    }
    const additionalInformation = initialByte & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      return BigInt(additionalInformation);
    }
    if (additionalInformation > 27) {
      throw new Error('Encoded item is not well-formed.');
    }
    const numberOfLengthBytes = Math.pow(2, additionalInformation - 24);
    return this.decodeUint(numberOfLengthBytes);
  }

  public decodeNegativeInteger(): bigint {
    throw new Error('Not implemented.');
  }

  public decodeByteString(): Uint8Array {
    const initialByte = this.data[this.position++];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.BYTE_STRING) {
      throw new Error('Major type mismatch, expected byte string.');
    }
    const additionalInformation = initialByte & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      const startPosition = this.position;
      const endPosition = startPosition + additionalInformation;
      this.position = endPosition;
      return this.data.subarray(startPosition, endPosition);
    }
    if (additionalInformation == 31) {
      throw new Error('Indefinite length byte string not supported.');
    }
    if (additionalInformation > 27) {
      throw new Error('Encoded item is not well-formed');
    }
    const numberOfLengthBytes = Math.pow(2, additionalInformation - 24);
    const textLength = this.decodeUint(numberOfLengthBytes);
    const startPosition = this.position;
    const endPosition = startPosition + Number(textLength);
    this.position = endPosition;
    return this.data.subarray(startPosition, endPosition);
  }

  public decodeTextString(): string {
    const initialByte = this.data[this.position++];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.TEXT_STRING) {
      throw new Error('Major type mismatch, expected text string.');
    }
    const additionalInformation = initialByte & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      const startPosition = this.position;
      const endPosition = startPosition + additionalInformation;
      this.position = endPosition;
      return new TextDecoder().decode(this.data.subarray(startPosition, endPosition));
    }
    if (additionalInformation == 31) {
      throw new Error('Indefinite length text string not supported.');
    }
    if (additionalInformation > 27) {
      throw new Error('Encoded item is not well-formed.');
    }
    const numberOfLengthBytes = Math.pow(2, additionalInformation - 24);
    const textLength = this.decodeUint(numberOfLengthBytes);
    const startPosition = this.position;
    const endPosition = startPosition + Number(textLength);
    this.position = endPosition;
    const textStringBytes = this.data.subarray(startPosition, endPosition);
    return new TextDecoder().decode(textStringBytes);
  }

  public decodeArray(): unknown[] {
    const initialByte = this.data[this.position++];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.ARRAY) {
      throw new Error('Major type mismatch, expected array.');
    }
    const result: unknown[] = [];
    const additionalInformation = initialByte & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      for (let i = 0; i < additionalInformation; i++) {
        result.push(this.decodeUnknownCbor());
      }
    }
    if (additionalInformation == 31) {
      throw new Error('Indefinite length array not supported.');
    }
    if (additionalInformation > 27) {
      throw new Error('Encoded item is not well-formed.');
    }
    const numberOfLengthBytes = Math.pow(2, additionalInformation - 24);
    const arrayLength = this.decodeUint(numberOfLengthBytes);
    for (let i = 0; i < arrayLength; i++) {
      result.push(this.decodeUnknownCbor());
    }
    return result;
  }

  public decodeMap(): Map<unknown, unknown> {
    throw new Error('Not implemented.');
  }

  public decodeTag(): [bigint, unknown] {
    const initialByte = this.data[this.position++];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.TAG) {
      throw new Error('Major type mismatch, expected tag.');
    }
    const additionalInformation = initialByte & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      return [BigInt(additionalInformation), this.decodeUnknownCbor()];
    }
    const numberOfLengthBytes = Math.pow(2, additionalInformation - 24);
    const tag = this.decodeUint(numberOfLengthBytes);
    return [tag, this.decodeUnknownCbor()];
  }

  private decodeUint(length: number): bigint {
    let t = BigInt(0);
    for (let i = 0; i < length; ++i) {
      t = (t << 8n) | BigInt(this.data[this.position++] & 0xff);
    }
    return t;
  }
}
