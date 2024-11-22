import { CborDecoder } from '../../../../src/codec/cbor/CborDecoder.js';
import { Base16Converter } from '../../../../src/util/Base16Converter.js';

describe('Cbor decoder test', () => {
  it('Decode unsigned integer', () => {
    expect(CborDecoder.decodeUnsignedInteger(Base16Converter.decode('0x00'), 0)).toEqual(0n);
    expect(CborDecoder.decodeUnsignedInteger(Base16Converter.decode('0x05'), 0)).toEqual(5n);
    expect(CborDecoder.decodeUnsignedInteger(Base16Converter.decode('0x1B0000000105F5E0FF'), 0)).toEqual(4394967295n);
    expect(() => CborDecoder.decodeUnsignedInteger(Base16Converter.decode('0x450000000000'), 0)).toThrow(
      'Major type mismatch, expected unsigned integer',
    );
  });

  it('Decode byte string', () => {
    expect(CborDecoder.decodeByteString(Base16Converter.decode('0x40'), 0)).toEqual(new Uint8Array());
    expect(CborDecoder.decodeByteString(Base16Converter.decode('0x450000000000'), 0)).toEqual(new Uint8Array(5));
    expect(
      CborDecoder.decodeByteString(
        Base16Converter.decode(
          '0x58FE0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        ),
        0,
      ),
    ).toEqual(new Uint8Array(254));
  });

  it('Decode text string', () => {
    expect(CborDecoder.decodeTextString(Base16Converter.decode('0x60'), 0)).toEqual('');
    expect(CborDecoder.decodeTextString(Base16Converter.decode('0x650A0A0A0A0A'), 0)).toEqual('\n'.repeat(5));
    expect(
      CborDecoder.decodeTextString(
        Base16Converter.decode('0x781B4C6F72656D20697073756D20646F6C6F722073697420616D6574'),
        0,
      ),
    ).toEqual('Lorem ipsum dolor sit amet');
    expect(
      CborDecoder.decodeTextString(
        Base16Converter.decode(
          '0x7901130A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A',
        ),
        0,
      ),
    ).toEqual('\n'.repeat(275));
  });
});
