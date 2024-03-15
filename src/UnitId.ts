import { IUnitId } from './IUnitId';

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
}
