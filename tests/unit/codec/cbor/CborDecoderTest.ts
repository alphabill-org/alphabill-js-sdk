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
});
