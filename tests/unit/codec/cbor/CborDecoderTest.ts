import { CborDecoder } from '../../../../src/codec/cbor/CborDecoder.js';
import { Base16Converter } from '../../../../src/util/Base16Converter.js';

describe('Cbor decoder test', () => {
  it('Decode unsigned integer', () => {
    expect(new CborDecoder(Base16Converter.decode('0x00')).decodeUnsignedInteger()).toEqual(0n);
    expect(new CborDecoder(Base16Converter.decode('0x05')).decodeUnsignedInteger()).toEqual(5n);
    expect(new CborDecoder(Base16Converter.decode('0x1B0000000105F5E0FF')).decodeUnsignedInteger()).toEqual(
      4394967295n,
    );
    expect(() => new CborDecoder(Base16Converter.decode('0x450000000000')).decodeUnsignedInteger()).toThrow(
      'Major type mismatch, expected unsigned integer',
    );
  });

  it('Decode byte string', () => {
    expect(new CborDecoder(Base16Converter.decode('0x40')).decodeByteString()).toEqual(new Uint8Array());
    expect(new CborDecoder(Base16Converter.decode('0x450000000000')).decodeByteString()).toEqual(new Uint8Array(5));
    expect(
      new CborDecoder(
        Base16Converter.decode(
          '0x58FE0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        ),
      ).decodeByteString(),
    ).toEqual(new Uint8Array(254));
  });

  it('Decode text string', () => {
    expect(new CborDecoder(Base16Converter.decode('0x60')).decodeTextString()).toEqual('');
    expect(new CborDecoder(Base16Converter.decode('0x650A0A0A0A0A')).decodeTextString()).toEqual('\n'.repeat(5));
    expect(
      new CborDecoder(
        Base16Converter.decode('0x781B4C6F72656D20697073756D20646F6C6F722073697420616D6574'),
      ).decodeTextString(),
    ).toEqual('Lorem ipsum dolor sit amet');
    expect(
      new CborDecoder(
        Base16Converter.decode(
          '0x7901130A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A',
        ),
      ).decodeTextString(),
    ).toEqual('\n'.repeat(275));
  });

  it('Decode array', () => {
    expect(new CborDecoder(Base16Converter.decode('0x834A00000000000000000000D864056474657374')).decodeArray()).toEqual(
      [new Uint8Array(10), [100n, 5n], 'test'],
    );
  });

  it('Decode tag', () => {
    expect(new CborDecoder(Base16Converter.decode('0xC1650A0A0A0A0A')).decodeTag()).toEqual([1n, '\n'.repeat(5)]);
    expect(new CborDecoder(Base16Converter.decode('0xD819650A0A0A0A0A')).decodeTag()).toEqual([25n, '\n'.repeat(5)]);
    expect(
      new CborDecoder(Base16Converter.decode('0xD678190A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A')).decodeTag(),
    ).toEqual([22n, '\n'.repeat(25)]);
    expect(new CborDecoder(Base16Converter.decode('0xDBFFFFFFFFFFFFFFFF650A0A0A0A0A')).decodeTag()).toEqual([
      18446744073709551615n,
      '\n'.repeat(5),
    ]);
    expect(new CborDecoder(Base16Converter.decode('0xC1C2650A0A0A0A0A')).decodeTag()).toEqual([1n, [2n, '\n'.repeat(5)]]);
  });
});
