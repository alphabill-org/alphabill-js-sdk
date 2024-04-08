import { IFeeCreditRecordDto } from './json-rpc/IFeeCreditRecordDto.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

export class FeeCreditRecord {
  public constructor(
    public readonly balance: bigint,
    private readonly _backlink: Uint8Array,
    public readonly timeout: bigint,
    public readonly locked: boolean,
  ) {
    this.balance = BigInt(this.balance);
    this.timeout = BigInt(this.timeout);
    this._backlink = new Uint8Array(this._backlink);
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public static create(data: IFeeCreditRecordDto): FeeCreditRecord {
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
        Backlink: ${Base16Converter.encode(this._backlink)}
        Timeout: ${this.timeout}
        Locked: ${this.locked}`;
  }
}
