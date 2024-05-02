import { IUnitId } from './IUnitId.js';
import { IUnitIdType } from './IUnitIdType.js';
import { Base16Converter } from './util/Base16Converter.js';

/**
 * Unit identifier.
 * @implements {IUnitId}
 */
export class UnitId implements IUnitId {
  public readonly type: IUnitIdType;

  /**
   * Unit identifier constructor.
   * @param {Uint8Array} type - Unit identifier type.
   * @param {Uint8Array} _bytes - Unit identifier bytes.
   */
  public constructor(
    type: Uint8Array,
    private readonly _bytes: Uint8Array,
  ) {
    this.type = new UnitIdType(type);
    this._bytes = new Uint8Array(this._bytes);
  }

  /**
   * @see {IUnitId.bytes}
   */
  public get bytes(): Uint8Array {
    return new Uint8Array(this._bytes);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return `${Base16Converter.encode(this._bytes)}`;
  }

  // TODO: Create equals method

  /**
   * Create unit identifier from bytes.
   * @param {Uint8Array} id - bytes.
   * @returns {IUnitId} Unit identifier.
   */
  public static fromBytes(id: Uint8Array): IUnitId {
    return new UnitId(id.slice(-1), id);
  }
}

/**
 * Unit identifier type.
 * @implements {IUnitIdType}
 */
class UnitIdType implements IUnitIdType {
  private readonly hex: string;

  /**
   * Unit identifier type constructor.
   * @param {Uint8Array} type.
   */
  public constructor(private readonly type: Uint8Array) {
    this.type = new Uint8Array(type);
    this.hex = Base16Converter.encode(this.type);
  }

  /**
   * @see {IUnitIdType.bytes}
   */
  public get bytes(): Uint8Array {
    return new Uint8Array(this.type);
  }

  /**
   * @see {IUnitIdType.toBase16}
   */
  public toBase16(): string {
    return this.hex;
  }
}
