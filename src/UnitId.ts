import { IUnitId } from './IUnitId.js';
import { Base16Converter } from './util/Base16Converter.js';

/**
 * Unit identifier.
 * @implements {IUnitId}
 */
export class UnitId implements IUnitId {
  /**
   * Unit identifier constructor.
   * @param {Uint8Array} _type - Unit identifier type.
   * @param {Uint8Array} _bytes - Unit identifier bytes.
   */
  public constructor(
    private readonly _type: Uint8Array,
    private readonly _bytes: Uint8Array,
  ) {
    this._type = new Uint8Array(this._type);
    this._bytes = new Uint8Array(this._bytes);
  }

  /**
   * @see {IUnitId.type}
   */
  public get type(): Uint8Array {
    return new Uint8Array(this._type);
  }

  /**
   * @see {IUnitId.bytes}
   */
  public get bytes(): Uint8Array {
    return new Uint8Array(this._bytes);
  }

  /**
   * Compare 2 objects if they are equal unit id.
   * @param {unknown} a First object.
   * @param {unknown} b Second object.
   * @returns {boolean} true if equal.
   */
  public static equals(a: unknown, b: unknown): boolean {
    if (!UnitId.isUnitId(a) || !UnitId.isUnitId(b)) {
      return false;
    }

    const obj1 = a as IUnitId;
    const obj2 = b as IUnitId;

    return UnitId.areUint8ArraysEqual(obj1.bytes, obj2.bytes) && UnitId.areUint8ArraysEqual(obj1.type, obj2.type);
  }

  /**
   * Check if object is unit id.
   * @param {unknown} obj Object to check.
   * @returns {boolean} true if unit id.
   */
  public static isUnitId(obj: unknown): boolean {
    if (!(obj instanceof Object) || !('bytes' in obj) || !('type' in obj)) {
      return false;
    }

    const unitId = obj as IUnitId;
    return ArrayBuffer.isView(unitId.bytes) && ArrayBuffer.isView(unitId.type);
  }

  /**
   * Create unit identifier from bytes.
   * @param {Uint8Array} id - bytes.
   * @returns {IUnitId} Unit identifier.
   */
  public static fromBytes(id: Uint8Array): IUnitId {
    return new UnitId(id.slice(-1), id);
  }

  private static areUint8ArraysEqual(arr1: Uint8Array, arr2: Uint8Array): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i += 1) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * @see {IUnitId.toString}
   */
  public toString(): string {
    return `${Base16Converter.encode(this._bytes)}`;
  }

  /**
   * Compare unit ID with another unit id.
   * @param {IUnitId} obj Unit id.
   * @returns {boolean} true if equal.
   */
  public equals(obj: IUnitId): boolean {
    return UnitId.equals(this, obj);
  }
}
