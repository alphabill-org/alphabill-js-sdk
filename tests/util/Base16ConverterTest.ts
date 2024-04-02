import { Base16Converter } from '../../src/util/Base16Converter.js';

describe('Hex coder', () => {
  it('encode works', () => {
    const hexEncodedString = '0xFF00FF';
    const encoded = Base16Converter.Encode(new Uint8Array([255, 0, 255]));

    expect(encoded).toBe(hexEncodedString);
  });

  it('decode works', () => {
    const result = new Uint8Array([255, 0, 255]);
    expect(Base16Converter.Decode('0xFF00FF')).toStrictEqual(result);
    expect(Base16Converter.Decode('FF00FF')).toStrictEqual(result);
  });
});
