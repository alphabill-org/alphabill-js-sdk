import { UnitId } from '../../src/UnitId.js';

describe('UnitId', () => {
  it('should equal to other unitId', () => {
    const obj1 = UnitId.fromBytes(new Uint8Array([1, 2, 3]));
    const obj2 = UnitId.fromBytes(new Uint8Array([1, 2, 3]));
    expect(obj1.type.bytes).toEqual(obj2.type.bytes);
    expect(obj1.type.toBase16()).toEqual(obj2.type.toBase16());
    expect(obj1.bytes).toEqual(obj2.bytes);
    expect(UnitId.equals(obj1, obj2)).toBeTruthy();
  });

  it('should not equal because different type', () => {
    const obj1 = new UnitId(new Uint8Array([3]), new Uint8Array([1, 2, 3]));
    const obj2 = new UnitId(new Uint8Array([2]), new Uint8Array([1, 2, 3]));
    expect(obj1.type.bytes).not.toEqual(obj2.type.bytes);
    expect(obj1.type.toBase16()).not.toEqual(obj2.type.toBase16());
    expect(obj1.bytes).toEqual(obj2.bytes);
    expect(UnitId.equals(obj1, obj2)).toBeFalsy();
  });

  it('should not equal because different bytes', () => {
    const obj1 = UnitId.fromBytes(new Uint8Array([1, 2, 3]));
    const obj2 = UnitId.fromBytes(new Uint8Array([1, 3, 3]));
    expect(obj1.type.bytes).toEqual(obj2.type.bytes);
    expect(obj1.type.toBase16()).toEqual(obj2.type.toBase16());
    expect(obj1.bytes).not.toEqual(obj2.bytes);
    expect(UnitId.equals(obj1, obj2)).toBeFalsy();
  });
});
