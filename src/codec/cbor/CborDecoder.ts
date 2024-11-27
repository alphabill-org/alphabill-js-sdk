import { BitMask } from './BitMask.js';
import { MajorType } from './MajorType.js';

export class CborDecoder {
  public static readUnsignedInteger(data: Uint8Array): bigint {
    const initialByte = data[0];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.UNSIGNED_INTEGER) {
      throw new Error('Major type mismatch, expected unsigned integer.');
    }
    return CborDecoder.readLength(majorType, data, 0)[0];
  }

  public static readNegativeInteger(): bigint {
    throw new Error('Not implemented.');
  }

  public static readByteString(data: Uint8Array): Uint8Array {
    const initialByte = data[0];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.BYTE_STRING) {
      throw new Error('Major type mismatch, expected byte string.');
    }
    const [length, dataStartPosition] = this.readLength(majorType, data, 0);
    const endPosition = dataStartPosition + Number(length);
    return data.subarray(dataStartPosition, endPosition);
  }

  public static readTextString(data: Uint8Array): string {
    const initialByte = data[0];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.TEXT_STRING) {
      throw new Error('Major type mismatch, expected text string.');
    }
    const [length, dataStartPosition] = this.readLength(majorType, data, 0);
    const endPosition = dataStartPosition + Number(length);
    return new TextDecoder().decode(data.subarray(dataStartPosition, endPosition));
  }

  public static readArray(data: Uint8Array): Uint8Array[] {
    const initialByte = data[0];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.ARRAY) {
      throw new Error('Major type mismatch, expected array.');
    }
    const [length, dataStartPosition] = this.readLength(majorType, data, 0);
    let newPosition = dataStartPosition;
    let content;
    const result: Uint8Array[] = [];
    for (let i = 0; i < length; i++) {
      [content, newPosition] = this.readRawCbor(data, newPosition);
      result.push(content);
    }
    return result;
  }

  public static readMap(): Map<unknown, unknown> {
    throw new Error('Not implemented.');
  }

  public static readTag(data: Uint8Array): [bigint, Uint8Array] {
    const initialByte = data[0];
    const majorType = initialByte & BitMask.MAJOR_TYPE;
    if (majorType != MajorType.TAG) {
      throw new Error('Major type mismatch, expected tag.');
    }
    const [tag, dataStartPosition] = this.readLength(majorType, data, 0);
    return [tag, CborDecoder.readRawCbor(data, dataStartPosition)[0]];
  }

  public static readLength(majorType: number, data: Uint8Array, offset: number): [bigint, number] {
    const additionalInformation = data[offset++] & BitMask.ADDITIONAL_INFORMATION;
    if (additionalInformation < 24) {
      return [BigInt(additionalInformation), offset];
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
      t = (t << 8n) | BigInt(data[offset++] & 0xff);
    }
    return [t, offset];
  }

  private static readRawCbor(data: Uint8Array, offset: number): [Uint8Array, number] {
    const majorType = data[offset] & BitMask.MAJOR_TYPE;
    const [length, dataStartPosition] = CborDecoder.readLength(majorType, data, offset);
    let endPosition = offset;

    let updatedOffset = dataStartPosition;
    switch (majorType) {
      case MajorType.BYTE_STRING:
      case MajorType.TEXT_STRING:
        endPosition += Number(length);
        break;
      case MajorType.ARRAY:
        for (let i = 0; i < Number(length); i++) {
          updatedOffset = this.readRawCbor(data, updatedOffset)[1];
        }
        endPosition = updatedOffset;
        break;
      case MajorType.TAG:
        endPosition += this.readRawCbor(data, offset)[1];
        break;
    }
    console.log('Offset: ' + offset + ', endPos: ' + endPosition);
    return [data.subarray(offset, endPosition), endPosition];
  }
}
