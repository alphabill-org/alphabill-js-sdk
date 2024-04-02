import { IUnitId } from './IUnitId.js';
import { Base16Converter } from './util/Base16Converter.js';

export class UnitId implements IUnitId {
  public constructor(
    private readonly type: Uint8Array,
    private readonly bytes: Uint8Array,
  ) {}

  public getType(): Uint8Array {
    return new Uint8Array(this.type);
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
