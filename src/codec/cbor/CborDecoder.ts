import { Base16Converter } from '../../util/Base16Converter.js';
import { BitMask } from './BitMask.js';
import { MajorType } from './MajorType.js';

export class CborDecoder {
  public static readUnsignedInteger(data: Uint8Array): bigint {
    const majorType = CborDecoder.readByte(data, 0) & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.UNSIGNED_INTEGER) {
      throw new Error('Major type mismatch, expected unsigned integer.');
    }

    return CborDecoder.readLength(majorType, data, 0).length;
  }

  public static readNegativeInteger(): bigint {
    throw new Error('Not implemented.');
  }

  public static readByteString(data: Uint8Array): Uint8Array {
    const majorType = CborDecoder.readByte(data, 0) & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.BYTE_STRING) {
      throw new Error('Major type mismatch, expected byte string.' + majorType);
    }
    const { length, position } = CborDecoder.readLength(majorType, data, 0);
    return this.read(data, position, Number(length));
  }

  public static readTextString(data: Uint8Array): string {
    const majorType = CborDecoder.readByte(data, 0) & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.TEXT_STRING) {
      throw new Error('Major type mismatch, expected text string.');
    }
    const { length, position } = CborDecoder.readLength(majorType, data, 0);
    return new TextDecoder().decode(CborDecoder.read(data, position, Number(length)));
  }

  public static readArray(data: Uint8Array): Uint8Array[] {
    const majorType = CborDecoder.readByte(data, 0) & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.ARRAY) {
      throw new Error('Major type mismatch, expected array.');
    }
    const parsedLength = CborDecoder.readLength(majorType, data, 0);
    let position = parsedLength.position;
    const result: Uint8Array[] = [];
    for (let i = 0; i < parsedLength.length; i++) {
      const rawCbor = CborDecoder.readRawCbor(data, position);
      position = rawCbor.position;
      result.push(rawCbor.data);
    }
    return result;
  }

  public static readMap(data: Uint8Array): Map<Uint8Array, Uint8Array> {
    const majorType = CborDecoder.readByte(data, 0) & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.MAP) {
      throw new Error('Major type mismatch, expected map.' + majorType);
    }
    const parsedLength = CborDecoder.readLength(majorType, data, 0);
    let position = parsedLength.position;
    const result: Map<Uint8Array, Uint8Array> = new Map();
    if (Number(parsedLength.length) % 2 !== 0) {
      throw new Error('Map must have even number of elements');
    }
    for (let i = 0; i <= Number(parsedLength.length) / 2; i++) {
      const key = CborDecoder.readRawCbor(data, position);
      position = key.position;
      const value = CborDecoder.readRawCbor(data, position);
      position = value.position;
      result.set(key.data, value.data);
    }
    return result;
  }

  public static readTag(data: Uint8Array): { tag: bigint; data: Uint8Array } {
    const majorType = CborDecoder.readByte(data, 0) & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.TAG) {
      throw new Error('Major type mismatch, expected tag.');
    }
    const { length: tag, position } = CborDecoder.readLength(majorType, data, 0);
    return { tag, data: CborDecoder.readRawCbor(data, position).data };
  }

  private static readLength(majorType: number, data: Uint8Array, offset: number): { length: bigint; position: number } {
    const additionalInformation = CborDecoder.readByte(data, offset) & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      return {
        length: BigInt(additionalInformation),
        position: offset + 1,
      };
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
      t = (t << 8n) | BigInt(CborDecoder.readByte(data, offset + 1 + i));
    }

    return {
      length: t,
      position: offset + numberOfLengthBytes + 1,
    };
  }

  private static readRawCbor(data: Uint8Array, offset: number): { data: Uint8Array; position: number } {
    const majorType = CborDecoder.readByte(data, offset) & BitMask.MAJOR_TYPE;
    const parsedLength = CborDecoder.readLength(majorType, data, offset);
    const length = parsedLength.length;
    let position = parsedLength.position;

    switch (majorType) {
      case MajorType.BYTE_STRING:
      case MajorType.TEXT_STRING:
        position += Number(length);
        break;
      case MajorType.ARRAY:
        for (let i = 0; i < length; i++) {
          position = this.readRawCbor(data, position).position;
        }
        break;
      case MajorType.MAP:
        for (let i = 0; i < length; i++) {
          position = this.readRawCbor(data, position).position;
          position = this.readRawCbor(data, position).position;
        }
        break;
      case MajorType.TAG:
        position = this.readRawCbor(data, position).position;
        break;
    }

    return {
      data: CborDecoder.read(data, offset, position - offset),
      position,
    };
  }

  private static readByte(data: Uint8Array, offset: number): number {
    if (data.length < offset) {
      throw new Error('Premature end of data.');
    }

    return data[offset] & 0xff;
  }

  private static read(data: Uint8Array, offset: number, length: number): Uint8Array {
    if (data.length < offset + length) {
      throw new Error('Premature end of data.');
    }

    return data.subarray(offset, offset + length);
  }
}
