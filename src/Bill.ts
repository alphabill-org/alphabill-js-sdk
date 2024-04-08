import { IBillDataDto } from './json-rpc/IBillDataDto.js';
import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export class Bill {
  public constructor(
    public readonly value: bigint,
    public readonly lastUpdate: bigint,
    private readonly _backlink: Uint8Array,
    public readonly locked: boolean,
  ) {
    this.value = BigInt(this.value);
    this.lastUpdate = BigInt(this.lastUpdate);
    this._backlink = new Uint8Array(this._backlink);
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public static create(data: IBillDataDto): Bill {
    return new Bill(
      BigInt(data.value),
      BigInt(data.lastUpdate),
      Base16Converter.decode(data.backlink),
      Boolean(Number(data.locked)),
    );
  }

  public toString(): string {
    return dedent`
      Bill
        Value: ${this.value}
        Last Update: ${this.lastUpdate}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Locked: ${this.locked}`;
  }
}
