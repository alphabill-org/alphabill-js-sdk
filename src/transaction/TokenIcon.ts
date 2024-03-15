export class TokenIcon {
  public constructor(
    public readonly type: string,
    public readonly data: Uint8Array,
  ) {}

  public toArray(): unknown[] {
    return [this.type, this.data];
  }
}
