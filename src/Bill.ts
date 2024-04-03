import { IBillDataDto } from './json-rpc/IBillDataDto.js';
import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export class Bill {
  public constructor(
    public readonly value: bigint,
    public readonly lastUpdate: bigint,
    public readonly backlink: Uint8Array,
    public readonly locked: boolean,
  ) {
    this.value = BigInt(this.value);
    this.lastUpdate = BigInt(this.lastUpdate);
    this.backlink = new Uint8Array(this.backlink);
  }

  public static async create(data: IBillDataDto): Promise<Bill> {
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
        Backlink: ${Base16Converter.encode(this.backlink)}
        Locked: ${this.locked}`;
  }
}
