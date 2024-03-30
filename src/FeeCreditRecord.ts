import { IFeeCreditRecordDto } from './json-rpc/IFeeCreditRecordDto.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

export class FeeCreditRecord {
  public constructor(
    public readonly balance: bigint,
    public readonly backlink: Uint8Array,
    public readonly timeout: bigint,
    public readonly locked: boolean,
  ) {}

  public static async Create(data: IFeeCreditRecordDto): Promise<FeeCreditRecord> {
    return new FeeCreditRecord(
      BigInt(data.Balance),
      Base64Converter.decode(data.Backlink),
      BigInt(data.Timeout),
      Boolean(Number(data.Locked)),
    );
  }

  public toString(): string {
    return dedent`
      FeeCreditRecord
        Balance: ${this.balance}
        Backlink: ${Base16Converter.encode(this.backlink)}
        Timeout: ${this.timeout}
        Locked: ${this.locked}`;
  }
}
