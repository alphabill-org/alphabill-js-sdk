import { CborEncoder } from '../../../../src/codec/cbor/CborEncoder.js';
import { Base16Converter } from '../../../../src/util/Base16Converter.js';

describe('Cbor encoder test', () => {
  it('Encode unsigned integer', () => {
    expect(CborEncoder.encodeUnsignedInteger(0)).toEqual(Base16Converter.decode('0x00'));
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

  it('Encode byte string', () => {
    expect(CborEncoder.encodeByteString(new Uint8Array())).toEqual(Base16Converter.decode('0x40'));
    expect(CborEncoder.encodeByteString(new Uint8Array(5))).toEqual(Base16Converter.decode('0x450000000000'));
    expect(CborEncoder.encodeByteString(new Uint8Array(22))).toEqual(
      Base16Converter.decode('0x5600000000000000000000000000000000000000000000'),
    );
    expect(CborEncoder.encodeByteString(new Uint8Array(25))).toEqual(
      Base16Converter.decode('0x581900000000000000000000000000000000000000000000000000'),
    );
    expect(CborEncoder.encodeByteString(new Uint8Array(254))).toEqual(
      Base16Converter.decode(
        '0x58FE0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      ),
    );
    expect(CborEncoder.encodeByteString(new Uint8Array(275))).toEqual(
      Base16Converter.decode(
        '0x5901130000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      ),
    );
  });

  it('Encode text string', () => {
    expect(CborEncoder.encodeTextString('\n'.repeat(5))).toEqual(Base16Converter.decode('0x650A0A0A0A0A'));
    expect(CborEncoder.encodeTextString('\n'.repeat(22))).toEqual(
      Base16Converter.decode('0x760A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTextString('\n'.repeat(25))).toEqual(
      Base16Converter.decode('0x78190A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTextString('\n'.repeat(275))).toEqual(
      Base16Converter.decode(
        '0x7901130A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A',
      ),
    );
  });

  it('Encode array', () => {
    expect(
      CborEncoder.encodeArray([
        CborEncoder.encodeArray([CborEncoder.encodeTag(5, CborEncoder.encodeTextString('test'))]),
        CborEncoder.encodeByteString(new Uint8Array(10)),
        CborEncoder.encodeTag(100, CborEncoder.encodeUnsignedInteger(5)),
        CborEncoder.encodeTextString('test'),
      ]),
    ).toEqual(Base16Converter.decode('0x8481C564746573744A00000000000000000000D864056474657374'));
  });

  it('Encode tag', () => {
    expect(CborEncoder.encodeTag(1, CborEncoder.encodeTextString('\n'.repeat(5)))).toEqual(
      Base16Converter.decode('0xC1650A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTag(22, CborEncoder.encodeTextString('\n'.repeat(25)))).toEqual(
      Base16Converter.decode('0xD678190A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTag(25, CborEncoder.encodeTextString('\n'.repeat(5)))).toEqual(
      Base16Converter.decode('0xD819650A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTag(275, CborEncoder.encodeTextString('\n'.repeat(5)))).toEqual(
      Base16Converter.decode('0xD90113650A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTag(18446744073709551615n, CborEncoder.encodeTextString('\n'.repeat(5)))).toEqual(
      Base16Converter.decode('0xDBFFFFFFFFFFFFFFFF650A0A0A0A0A'),
    );
    expect(CborEncoder.encodeTag(1, CborEncoder.encodeTag(2, CborEncoder.encodeTextString('\n'.repeat(5))))).toEqual(
      Base16Converter.decode('0xC1C2650A0A0A0A0A'),
    );
  });

  it('Encode map', () => {
    expect(CborEncoder.encodeMap(new Map<string, Uint8Array>([]))).toEqual(Base16Converter.decode('0xA0'));
    expect(
      Base16Converter.encode(
        CborEncoder.encodeMap(
          new Map([
            [Base16Converter.encode(CborEncoder.encodeTextString('a')), CborEncoder.encodeTextString('A')],
            [Base16Converter.encode(CborEncoder.encodeTextString('b')), CborEncoder.encodeTextString('B')],
            [Base16Converter.encode(CborEncoder.encodeTextString('c')), CborEncoder.encodeTextString('C')],
            [
              Base16Converter.encode(CborEncoder.encodeArray([CborEncoder.encodeTextString('d')])),
              CborEncoder.encodeTextString('D'),
            ],
            [Base16Converter.encode(CborEncoder.encodeUnsignedInteger(1)), CborEncoder.encodeTextString('E')],
          ]),
        ),
      ),
    ).toEqual('0xA50161456161614161626142616361438161646144');
  });
});
