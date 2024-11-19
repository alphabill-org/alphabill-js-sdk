import { Base16Converter } from '../../../../src/util/Base16Converter.js';
import { Base64Converter } from '../../../../src/util/Base64Converter.js';

describe('Node Codec test - Valid input', () => {
  it('Decodes and encodes successfully', () => {
    const base64Cbor = 'g4UAZXRyYW5zQQGDRIMAAfYB9oMAAPZBAfY=';
    const bytes = Base64Converter.decode(base64Cbor);
    console.log(Base16Converter.encode(bytes));
    console.log(parseTag(bytes, 0));
    // const parsed = await cborCodecNode.decode(Buffer.from(base64Cbor, 'base64'));
    // console.log(parsed);

    // expect(parsed[0][1]).toEqual('trans');
    // const uint8Array = await cborCodecNode.encode(parsed);
    // expect(Buffer.from(uint8Array).toString('base64')).toEqual(base64Cbor);
  });
});

function parseTag(bytes: Uint8Array, offset: number): ICborTag<unknown> {
  const type = bytes[offset] >> 5;
  // Check additional information, if indefinite do sth in parseArray
  switch (type) {
    case 0:
      return parseUint(bytes, offset);
    case 1:
      throw new Error('Negative integers not supported');
    case 2:
      return parseBytes(bytes, offset);
    case 3:
      return parseString(bytes, offset);
    case 4:
      return parseArray(bytes, offset);
    case 7:
      return { offset, length: offset + 1, value: bytes[offset] & 0x1f };
    default:
      console.log(type, bytes[offset] & 0x1f, offset);
      return { length: 1, offset, value: null };
  }
}

function parseArray(bytes: Uint8Array, offset: number): ICborTag<unknown[]> {
  const arrayLength = bytes[offset] & 0x1f;
  let position = 0;
  let length = 1;
  const value: unknown[] = [];
  while (offset < bytes.length && (arrayLength === null || position < arrayLength)) {
    const tag = parseTag(bytes, offset + length);
    length = length + tag.length;
    value.push(tag);
    position += 1;
  }

  return {
    value,
    offset,
    length,
  };
}

function parseUint(bytes: Uint8Array, offset: number): ICborTag<bigint> {
  const additionalInformation = bytes[offset] & 0x1f;
  let length = 1;

  // TODO: parse as uint later
  switch (additionalInformation) {
    case 24:
    case 25:
    case 26:
    case 27:
      length = length + additionalInformation - 23;
      break;
    default:
      if (additionalInformation > 27) {
        throw new Error(`Invalid uint additional information: ${additionalInformation}`);
      }
  }

  return {
    value: 0n,
    offset,
    length,
  };
}

function parseString(bytes: Uint8Array, offset: number): ICborTag<string> {
  const additionalInformation = bytes[offset] & 0x1f;
  const length = 1 + additionalInformation;

  return {
    value: '',
    offset,
    length,
  };
}

function parseBytes(bytes: Uint8Array, offset: number): ICborTag<Uint8Array> {
  const additionalInformation = bytes[offset] & 0x1f;
  const length = 1 + additionalInformation;

  return {
    value: new Uint8Array(additionalInformation),
    offset,
    length,
  };
}

interface ICborTag<T> {
  offset: number;
  length: number;
  value: T;
}
