import { IUnitId } from './IUnitId.js';
import { IUnitIdType } from './IUnitIdType.js';
import { Base16Converter } from './util/Base16Converter.js';

/**
 * @implements {IUnitId}
 */
export class UnitId implements IUnitId {
  private readonly type: IUnitIdType;

  public constructor(
    type: Uint8Array,
    private readonly bytes: Uint8Array,
  ) {
    this.type = new UnitIdType(type);
    this.bytes = new Uint8Array(bytes);
  }

  public getType(): IUnitIdType {
    return this.type;
  }

  public getBytes(): Uint8Array {
    return new Uint8Array(this.bytes);
  }

  public toString(): string {
    return `${Base16Converter.encode(this.bytes)}`;
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

  public getBytes(): Uint8Array {
    return new Uint8Array(this.type);
  }

  public toBase16(): string {
    return this.hex;
  }
}
