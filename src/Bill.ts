import { IBillDataDto } from './json-rpc/IBillDataDto.js';
import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

export class Bill {
  public constructor(
    private readonly value: bigint,
    private readonly lastUpdate: bigint,
    private readonly backlink: Uint8Array,
    private readonly locked: boolean,
  ) {
    this.value = BigInt(this.value);
    this.lastUpdate = BigInt(this.lastUpdate);
    this.backlink = new Uint8Array(this.backlink);
  }

  public getValue(): bigint {
    return this.value;
  }

  public getLastUpdate(): bigint {
    return this.lastUpdate;
  }

  public getBacklink(): Uint8Array {
    return new Uint8Array(this.backlink);
  }

  public isLocked(): boolean {
    return this.locked;
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
        Backlink: ${Base16Converter.encode(this.backlink)}
        Locked: ${this.locked}`;
  }
}
