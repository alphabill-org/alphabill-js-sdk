import { BitMask } from './BitMask.js';
import { MajorType } from './MajorType.js';

export class CborDecoder {
  private readonly data: Uint8Array;
  private position: number = 0;

  public constructor(data: Uint8Array) {
    this.data = new Uint8Array(data);
  }

  public readUnsignedInteger(): bigint {
    const initialByte = this.data[this.position];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.UNSIGNED_INTEGER) {
      throw new Error('Major type mismatch, expected unsigned integer.');
    }
    return this.readLength(majorType);
  }

  public readNegativeInteger(): bigint {
    throw new Error('Not implemented.');
  }

  public readByteString(): Uint8Array {
    const initialByte = this.data[this.position];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.BYTE_STRING) {
      throw new Error('Major type mismatch, expected byte string.');
    }
    const length = Number(this.readLength(majorType));
    return this.data.subarray(this.position, this.position + length);
  }

  public readTextString(): string {
    const initialByte = this.data[this.position];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.TEXT_STRING) {
      throw new Error('Major type mismatch, expected text string.');
    }
    const length = Number(this.readLength(majorType));
    return new TextDecoder().decode(this.data.subarray(this.position, this.position + length));
  }

  public readArray(): Uint8Array[] {
    const initialByte = this.data[this.position];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.ARRAY) {
      throw new Error('Major type mismatch, expected array.');
    }
    const length = this.readLength(majorType);
    const result: Uint8Array[] = [];
    for (let i = 0; i < length; i++) {
      result.push(this.readRawCbor());
    }

    return result;
  }

  public readMap(): Map<unknown, unknown> {
    throw new Error('Not implemented.');
  }

  public readTag(): [bigint, Uint8Array] {
    const initialByte = this.data[this.position];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.TAG) {
      throw new Error('Major type mismatch, expected tag.');
    }
    const tag = this.readLength(majorType);
    return [tag, this.readRawCbor()];
  }

  private readLength(majorType: number): bigint {
    const additionalInformation = this.data[this.position++] & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      return BigInt(additionalInformation);
    }
    switch (majorType) {
      case MajorType.ARRAY:
      case MajorType.BYTE_STRING:
      case MajorType.TEXT_STRING:
        if (additionalInformation == 31) {
          throw new Error('Indefinite length array not supported.');
        }
    }

    if (additionalInformation > 27) {
      throw new Error('Encoded item is not well-formed.');
    }
    const numberOfLengthBytes = Math.pow(2, additionalInformation - 24);
    let t = BigInt(0);
    for (let i = 0; i < numberOfLengthBytes; ++i) {
      t = (t << 8n) | BigInt(this.data[this.position++] & 0xff);
    }
    return t;
  }

  private readRawCbor(): Uint8Array {
    const offset = this.position;
    const majorType = this.data[this.position] & BitMask.MAJOR_TYPE;
    const length = this.readLength(majorType);

    switch (majorType) {
      case MajorType.BYTE_STRING:
      case MajorType.TEXT_STRING:
        this.position += Number(length);
        break;
      case MajorType.ARRAY:
        for (let i = 0; i < Number(length); i++) {
          this.readRawCbor();
        }
        break;
      case MajorType.TAG:
        this.readRawCbor();
        break;
    }
    return this.data.subarray(offset, this.position);
  }
}
