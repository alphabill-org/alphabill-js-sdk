import { CborDecoder } from '../../../../src/codec/cbor/CborDecoder.js';
import { Base16Converter } from '../../../../src/util/Base16Converter.js';

describe('Cbor decoder test', () => {
  it('Decode unsigned integer', () => {
    expect(new CborDecoder(Base16Converter.decode('0x00')).readUnsignedInteger()).toEqual(0n);
    expect(new CborDecoder(Base16Converter.decode('0x05')).readUnsignedInteger()).toEqual(5n);
    expect(new CborDecoder(Base16Converter.decode('0x1B0000000105F5E0FF')).readUnsignedInteger()).toEqual(
      4394967295n,
    );
    expect(() => new CborDecoder(Base16Converter.decode('0x450000000000')).readUnsignedInteger()).toThrow(
      'Major type mismatch, expected unsigned integer',
    );
  });

  it('Decode byte string', () => {
    expect(new CborDecoder(Base16Converter.decode('0x40')).readByteString()).toEqual(new Uint8Array());
    expect(new CborDecoder(Base16Converter.decode('0x450000000000')).readByteString()).toEqual(new Uint8Array(5));
    expect(
      new CborDecoder(
        Base16Converter.decode(
          '0x58FE0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        ),
      ).readByteString(),
    ).toEqual(new Uint8Array(254));
  });

  it('Decode text string', () => {
    expect(new CborDecoder(Base16Converter.decode('0x60')).readTextString()).toEqual('');
    expect(new CborDecoder(Base16Converter.decode('0x650A0A0A0A0A')).readTextString()).toEqual('\n'.repeat(5));
    expect(
      new CborDecoder(
        Base16Converter.decode('0x781B4C6F72656D20697073756D20646F6C6F722073697420616D6574'),
      ).readTextString(),
    ).toEqual('Lorem ipsum dolor sit amet');
    expect(
      new CborDecoder(
        Base16Converter.decode(
          '0x7901130A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A',
        ),
      ).readTextString(),
    ).toEqual('\n'.repeat(275));
  });

  it('Decode array', () => {
    expect(
      new CborDecoder(Base16Converter.decode('0x834A00000000000000000000D864056474657374'))
        .readArray()
        .map((element) => Base16Converter.encode(element)),
    ).toEqual(['0x4A00000000000000000000', '0xD86405', '0x6474657374']);
  });

  it('Decode tag', () => {
    expect(new CborDecoder(Base16Converter.decode('0xC1650A0A0A0A0A')).readTag()).toEqual([
      1n,
      Base16Converter.decode('0x650A0A0A0A0A'),
    ]);
    expect(new CborDecoder(Base16Converter.decode('0xD819650A0A0A0A0A')).readTag()).toEqual([
      25n,
      Base16Converter.decode('0x650A0A0A0A0A'),
    ]);
    expect(
      new CborDecoder(Base16Converter.decode('0xD678190A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A')).readTag(),
    ).toEqual([22n, Base16Converter.decode('0x78190A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A')]);
    expect(new CborDecoder(Base16Converter.decode('0xDBFFFFFFFFFFFFFFFF650A0A0A0A0A')).readTag()).toEqual([
      18446744073709551615n,
      Base16Converter.decode('0x650A0A0A0A0A'),
    ]);
    expect(new CborDecoder(Base16Converter.decode('0xC1C2650A0A0A0A0A')).readTag()).toEqual([
      1n,
      Base16Converter.decode('0xC2650A0A0A0A0A'),
    ]);
  });
});
