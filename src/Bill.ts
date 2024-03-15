import { Base16Converter } from './util/Base16Converter.js';
import { IBillDataDto } from './json-rpc/IBillDataDto.js';

export class Bill {
  public constructor(
    public readonly value: bigint,
    public readonly lastUpdate: bigint,
    public readonly backlink: Uint8Array,
    public readonly locked: boolean,
  ) {}

  public static async Create(data: IBillDataDto): Promise<Bill> {
    return new Bill(
      BigInt(data.value),
      BigInt(data.lastUpdate),
      Base16Converter.decode(data.backlink),
      Boolean(Number(data.locked)),
    );
  }
}
