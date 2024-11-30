import { CborDecoder } from '../../../../src/codec/cbor/CborDecoder.js';
import { Base16Converter } from '../../../../src/util/Base16Converter.js';

describe('Cbor decoder test', () => {
  it('Decode unsigned integer', () => {
    expect(CborDecoder.readUnsignedInteger(Base16Converter.decode('0x00'))).toEqual(0n);
    expect(CborDecoder.readUnsignedInteger(Base16Converter.decode('0x05'))).toEqual(5n);
    expect(CborDecoder.readUnsignedInteger(Base16Converter.decode('0x1B0000000105F5E0FF'))).toEqual(4394967295n);
    expect(() => CborDecoder.readUnsignedInteger(Base16Converter.decode('0x450000000000'))).toThrow(
      'Major type mismatch, expected unsigned integer',
    );
  });

  it('Decode byte string', () => {
    expect(CborDecoder.readByteString(Base16Converter.decode('0x40'))).toEqual(new Uint8Array());
    expect(CborDecoder.readByteString(Base16Converter.decode('0x450000000000'))).toEqual(new Uint8Array(5));
    expect(
      CborDecoder.readByteString(
        Base16Converter.decode(
          '0x58FE0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        ),
      ),
    ).toEqual(new Uint8Array(254));
  });

  it('Decode text string', () => {
    expect(CborDecoder.readTextString(Base16Converter.decode('0x60'))).toEqual('');
    expect(CborDecoder.readTextString(Base16Converter.decode('0x650A0A0A0A0A'))).toEqual('\n'.repeat(5));
    expect(
      CborDecoder.readTextString(Base16Converter.decode('0x781A4C6F72656D20697073756D20646F6C6F722073697420616D6574')),
    ).toEqual('Lorem ipsum dolor sit amet');
    expect(
      CborDecoder.readTextString(
        Base16Converter.decode(
          '0x7901130A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A',
        ),
      ),
    ).toEqual('\n'.repeat(275));
    expect(() =>
      CborDecoder.readTextString(Base16Converter.decode('0x781B4C6F72656D20697073756D20646F6C6F722073697420616D6574')),
    ).toThrow('Premature end of data.');
  });

  it('Decode array', () => {
    expect(
      CborDecoder.readArray(Base16Converter.decode('0x8481C564746573744A00000000000000000000D864056474657374')).map(
        (element) => Base16Converter.encode(element),
      ),
    ).toEqual(['0x81C56474657374', '0x4A00000000000000000000', '0xD86405', '0x6474657374']);
  });

  it('Decode map', () => {
    const decodedMap = CborDecoder.readMap(Base16Converter.decode('0xA2646B657931182A646B6579326676616C756532'));
    const decodedKeys: string[] = [];
    const decodedValues: string[] = [];
    for (const [key, value] of decodedMap) {
      decodedKeys.push(Base16Converter.encode(key));
      decodedValues.push(Base16Converter.encode(value));
    }
    const expectedKeys = ['0x646B657931', '0x646B657932'];
    const expectedValues = ['0x182A', '0x6676616C756532'];
    expect(decodedKeys).toEqual(expectedKeys);
    expect(decodedValues).toEqual(expectedValues);
  });

  it('Decode tag', () => {
    expect(CborDecoder.readTag(Base16Converter.decode('0xC1650A0A0A0A0A'))).toEqual({
      tag: 1n,
      data: Base16Converter.decode('0x650A0A0A0A0A'),
    });
    expect(CborDecoder.readTag(Base16Converter.decode('0xD819650A0A0A0A0A'))).toEqual({
      tag: 25n,
      data: Base16Converter.decode('0x650A0A0A0A0A'),
    });
    expect(
      CborDecoder.readTag(Base16Converter.decode('0xD678190A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A')),
    ).toEqual({
      tag: 22n,
      data: Base16Converter.decode('0x78190A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A'),
    });
    expect(CborDecoder.readTag(Base16Converter.decode('0xDBFFFFFFFFFFFFFFFF650A0A0A0A0A'))).toEqual({
      tag: 18446744073709551615n,
      data: Base16Converter.decode('0x650A0A0A0A0A'),
    });
    expect(CborDecoder.readTag(Base16Converter.decode('0xC1C2650A0A0A0A0A'))).toEqual({
      tag: 1n,
      data: Base16Converter.decode('0xC2650A0A0A0A0A'),
    });
  });

  it('Decode bitstring', () => {
    expect(() => CborDecoder.readBitString(new Uint8Array([]))).toThrow('Invalid bit string encoding: empty input');
    expect(() => CborDecoder.readBitString(new Uint8Array([0]))).toThrow(
      'Invalid bit string encoding: last byte doesnt contain end marker',
    );
    expect(() => CborDecoder.readBitString(new Uint8Array([0xff, 0]))).toThrow(
      'Invalid bit string encoding: last byte doesnt contain end marker',
    );
    expect(CborDecoder.readBitString(new Uint8Array([0b1000_0000]))).toEqual({ length: 0, data: new Uint8Array() });
    expect(CborDecoder.readBitString(new Uint8Array([0b0100_0000]))).toEqual({ length: 1, data: new Uint8Array([0]) });
    expect(CborDecoder.readBitString(new Uint8Array([0b1100_0000]))).toEqual({
      length: 1,
      data: new Uint8Array([128]),
    });
    expect(CborDecoder.readBitString(new Uint8Array([0b1000_0011]))).toEqual({
      length: 7,
      data: new Uint8Array([0b1000_0010]),
    });
    expect(CborDecoder.readBitString(new Uint8Array([0b0001_0001]))).toEqual({
      length: 7,
      data: new Uint8Array([0b0001_0000]),
    });
    expect(CborDecoder.readBitString(new Uint8Array([0, 0b1000_0000]))).toEqual({
      length: 8,
      data: new Uint8Array([0]),
    });
    expect(CborDecoder.readBitString(new Uint8Array([1, 0b1000_0000]))).toEqual({
      length: 8,
      data: new Uint8Array([1]),
    });
    expect(CborDecoder.readBitString(new Uint8Array([128, 0b1000_0000]))).toEqual({
      length: 8,
      data: new Uint8Array([128]),
    });
    expect(CborDecoder.readBitString(new Uint8Array([0xff, 0b1000_0000]))).toEqual({
      length: 8,
      data: new Uint8Array([0xff]),
    });
    expect(CborDecoder.readBitString(new Uint8Array([0b0001_0001, 0b1000_0000]))).toEqual({
      length: 8,
      data: new Uint8Array([0b0001_0001]),
    });
    expect(CborDecoder.readBitString(new Uint8Array([0b0001_0001, 0b1100_0000]))).toEqual({
      length: 9,
      data: new Uint8Array([0b0001_0001, 128]),
    });
  });
});
