import { Base16Converter } from '../../../../src/util/Base16Converter.js';
import { CborEncoder } from '../../../../src/codec/cbor/CborEncoder.js';

describe('Cbor encoder test', () => {
  it('Encode unsigned integer', () => {
    expect(CborEncoder.encodeUnsignedInteger(5)).toEqual(Base16Converter.decode('0x05'));
    expect(CborEncoder.encodeUnsignedInteger(22)).toEqual(Base16Converter.decode('0x16'));
    expect(CborEncoder.encodeUnsignedInteger(254)).toEqual(Base16Converter.decode('0x18FE'));
    expect(CborEncoder.encodeUnsignedInteger(256)).toEqual(Base16Converter.decode('0x190100'));
    expect(CborEncoder.encodeUnsignedInteger(75000)).toEqual(Base16Converter.decode('0x1A000124F8'));
    expect(CborEncoder.encodeUnsignedInteger(4394967295)).toEqual(Base16Converter.decode('0x1B0000000105F5E0FF'));
    expect(CborEncoder.encodeUnsignedInteger(18446744073709551615n)).toEqual(
      Base16Converter.decode('0x1BFFFFFFFFFFFFFFFF'),
    );
    expect(() => CborEncoder.encodeUnsignedInteger(-5n)).toThrow('Only unsigned numbers are allowed.');
    expect(() => CborEncoder.encodeUnsignedInteger(-25n)).toThrow('Only unsigned numbers are allowed.');
    expect(() => CborEncoder.encodeUnsignedInteger(18446744073709551616n)).toThrow('Number is not unsigned long.');
  });

  it('Encode bytes', () => {
    expect(CborEncoder.encodeBytes(new Uint8Array(5))).toEqual(Base16Converter.decode('0x450000000000'));
    expect(CborEncoder.encodeBytes(new Uint8Array(22))).toEqual(
      Base16Converter.decode('0x5600000000000000000000000000000000000000000000'),
    );
    expect(CborEncoder.encodeBytes(new Uint8Array(25))).toEqual(
      Base16Converter.decode('0x581900000000000000000000000000000000000000000000000000'),
    );
    expect(CborEncoder.encodeBytes(new Uint8Array(254))).toEqual(
      Base16Converter.decode(
        '0x58FE0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      ),
    );
    expect(CborEncoder.encodeBytes(new Uint8Array(275))).toEqual(
      Base16Converter.decode(
        '0x5901130000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      ),
    );
  });

  it('Encode string', () => {
    expect(CborEncoder.encodeString('\n'.repeat(5))).toEqual(Base16Converter.decode('0x650A0A0A0A0A'));
    expect(CborEncoder.encodeString('\n'.repeat(22))).toEqual(
      Base16Converter.decode('0x760A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A'),
    );
    expect(CborEncoder.encodeString('\n'.repeat(25))).toEqual(
      Base16Converter.decode('0x78190A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A'),
    );
    expect(CborEncoder.encodeString('\n'.repeat(275))).toEqual(
      Base16Converter.decode(
        '0x7901130A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A',
      ),
    );
  });

  it('Encode array', () => {
    expect(
      CborEncoder.encodeArray([
        CborEncoder.encodeBytes(new Uint8Array(10)),
        CborEncoder.encodeTag(100, CborEncoder.encodeUnsignedInteger(5)),
        CborEncoder.encodeString('test'),
      ]),
    ).toEqual(Base16Converter.decode('0x834A00000000000000000000D864056474657374'));
  });

  it('Encode tag', () => {
    expect(CborEncoder.encodeTag(1, CborEncoder.encodeString('\n'.repeat(5)))).toEqual(
      Base16Converter.decode('0xC1650A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTag(22, CborEncoder.encodeString('\n'.repeat(25)))).toEqual(
      Base16Converter.decode('0xD678190A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTag(25, CborEncoder.encodeString('\n'.repeat(5)))).toEqual(
      Base16Converter.decode('0xD819650A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTag(275, CborEncoder.encodeString('\n'.repeat(5)))).toEqual(
      Base16Converter.decode('0xD90113650A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTag(18446744073709551615n, CborEncoder.encodeString('\n'.repeat(5)))).toEqual(
      Base16Converter.decode('0xDBFFFFFFFFFFFFFFFF650A0A0A0A0A'),
    );
  });
});
