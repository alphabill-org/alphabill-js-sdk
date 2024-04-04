import { IFeeCreditRecordDto } from './json-rpc/IFeeCreditRecordDto.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

export class FeeCreditRecord {
  public constructor(
    private readonly balance: bigint,
    private readonly backlink: Uint8Array,
    private readonly timeout: bigint,
    private readonly locked: boolean,
  ) {
    this.balance = BigInt(this.balance);
    this.timeout = BigInt(this.timeout);
    this.backlink = new Uint8Array(this.backlink);
  }

  public getBalance(): bigint {
    return this.balance;
  }

  public getBacklink(): Uint8Array {
    return new Uint8Array(this.backlink);
  }

  public getTimeout(): bigint {
    return this.timeout;
  }

  public isLocked(): boolean {
    return this.locked;
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
        Backlink: ${Base16Converter.encode(this.backlink)}
        Timeout: ${this.timeout}
        Locked: ${this.locked}`;
  }
}
