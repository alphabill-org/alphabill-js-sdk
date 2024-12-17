import { BitString } from '../../../../src/BitString.js';

describe('BitString', () => {
  it('Decode bitstring', () => {
    expect(() => BitString.create(new Uint8Array([]))).toThrow('Invalid bit string encoding: empty input');
    expect(() => BitString.create(new Uint8Array([0]))).toThrow(
      'Invalid bit string encoding: last byte doesnt contain end marker',
    );
    expect(() => BitString.create(new Uint8Array([0xff, 0]))).toThrow(
      'Invalid bit string encoding: last byte doesnt contain end marker',
    );
    expect(BitString.create(new Uint8Array([0b1000_0000]))).toMatchObject({ length: 0, _bits: new Uint8Array(0) });
    expect(BitString.create(new Uint8Array([0b0100_0000]))).toMatchObject({ length: 1, _bits: new Uint8Array([0]) });
    expect(BitString.create(new Uint8Array([0b1100_0000]))).toMatchObject({
      length: 1,
      _bits: new Uint8Array([128]),
    });
    expect(BitString.create(new Uint8Array([0b1000_0011]))).toMatchObject({
      length: 7,
      _bits: new Uint8Array([0b1000_0010]),
    });
    expect(BitString.create(new Uint8Array([0b0001_0001]))).toMatchObject({
      length: 7,
      _bits: new Uint8Array([0b0001_0000]),
    });
    expect(BitString.create(new Uint8Array([0, 0b1000_0000]))).toMatchObject({
      length: 8,
      _bits: new Uint8Array([0]),
    });
    expect(BitString.create(new Uint8Array([1, 0b1000_0000]))).toMatchObject({
      length: 8,
      _bits: new Uint8Array([1]),
    });
    expect(BitString.create(new Uint8Array([128, 0b1000_0000]))).toMatchObject({
      length: 8,
      _bits: new Uint8Array([128]),
    });
    expect(BitString.create(new Uint8Array([0xff, 0b1000_0000]))).toMatchObject({
      length: 8,
      _bits: new Uint8Array([0xff]),
    });
    expect(BitString.create(new Uint8Array([0b0001_0001, 0b1000_0000]))).toMatchObject({
      length: 8,
      _bits: new Uint8Array([0b0001_0001]),
    });
    expect(BitString.create(new Uint8Array([0b0001_0001, 0b1100_0000]))).toMatchObject({
      length: 9,
      _bits: new Uint8Array([0b0001_0001, 128]),
    });
  });

  it('Encode bitstring', () => {
    expect(new BitString(new Uint8Array([]), 0).encode()).toEqual(new Uint8Array([128]));
    expect(new BitString(new Uint8Array([0]), 1).encode()).toEqual(new Uint8Array([0b0100_0000]));
    expect(new BitString(new Uint8Array([128]), 1).encode()).toEqual(new Uint8Array([0b1100_0000]));
    expect(new BitString(new Uint8Array([0]), 7).encode()).toEqual(new Uint8Array([1]));
    expect(new BitString(new Uint8Array([0b1111_1110]), 7).encode()).toEqual(new Uint8Array([0xff]));
    expect(new BitString(new Uint8Array([0]), 8).encode()).toEqual(new Uint8Array([0, 128]));
    expect(new BitString(new Uint8Array([0xff]), 8).encode()).toEqual(new Uint8Array([0xff, 128]));
    expect(new BitString(new Uint8Array([0, 0]), 9).encode()).toEqual(new Uint8Array([0, 0b0100_0000]));
    expect(new BitString(new Uint8Array([0xff, 0xff]), 9).encode()).toEqual(new Uint8Array([0xff, 0b1100_0000]));
  });
});
