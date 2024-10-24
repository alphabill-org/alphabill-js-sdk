import { bytesToNumberBE } from '@noble/curves/abstract/utils';
import { IUnitId } from './IUnitId.js';
import { areUint8ArraysEqual } from './util/ArrayUtils.js';
import { Base16Converter } from './util/Base16Converter.js';

/**
 * Unit identifier.
 * @implements {IUnitId}
 */
export class UnitId implements IUnitId {
  public readonly type: bigint;

  /**
   * Unit identifier constructor.
   * @param {Uint8Array} type - Unit identifier type.
   * @param {Uint8Array} _bytes - Unit identifier bytes.
   */
  public constructor(
    type: Uint8Array,
    private readonly _bytes: Uint8Array,
  ) {
    this.type = bytesToNumberBE(type);
    this._bytes = new Uint8Array(this._bytes);
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

    return areUint8ArraysEqual(obj1.bytes, obj2.bytes) && obj1.type === obj2.type;
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
    return ArrayBuffer.isView(unitId.bytes) && typeof unitId.type === 'bigint';
  }

  /**
   * Create unit identifier from bytes.
   * @param {Uint8Array} id - bytes.
   * @returns {IUnitId} Unit identifier.
   */
  public static fromBytes(id: Uint8Array): IUnitId {
    return new UnitId(id.slice(-1), id);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
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
