import { Base64Converter } from './util/Base64Converter.js';
import { IFeeCreditRecordDto } from './json-rpc/IFeeCreditRecordDto.js';

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
}
