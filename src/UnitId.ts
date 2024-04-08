import { IUnitId } from './IUnitId.js';
import { IUnitIdType } from './IUnitIdType.js';
import { Base16Converter } from './util/Base16Converter.js';

/**
 * @implements {IUnitId}
 */
export class UnitId implements IUnitId {
  public readonly type: IUnitIdType;

  public constructor(
    type: Uint8Array,
    private readonly _bytes: Uint8Array,
  ) {
    this.type = new UnitIdType(type);
    this._bytes = new Uint8Array(this._bytes);
  }

  public get bytes(): Uint8Array {
    return new Uint8Array(this._bytes);
  }

  public toString(): string {
    return `${Base16Converter.encode(this._bytes)}`;
  }

  public static fromBytes(id: Uint8Array): IUnitId {
    return new UnitId(id.slice(-1), id);
  }
}

class UnitIdType implements IUnitIdType {
  private readonly hex: string;

  public constructor(private readonly type: Uint8Array) {
    this.type = new Uint8Array(type);
    this.hex = Base16Converter.encode(this.type);
  }

  public get bytes(): Uint8Array {
    return new Uint8Array(this.type);
  }

  public toBase16(): string {
    return this.hex;
  }
}
