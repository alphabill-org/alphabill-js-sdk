import { IFeeCreditRecordDto } from './json-rpc/IFeeCreditRecordDto.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

/**
 * Fee credit record.
 */
export class FeeCreditRecord {
  /**
   * Fee credit record constructor.
   * @param {bigint} balance Fee credit balance.
   * @param {Uint8Array} _backlink Fee credit backlink.
   * @param {bigint} timeout Fee credit timeout.
   * @param {boolean} locked Is fee credit locked.
   */
  public constructor(
    /**
     * Balance.
     */
    public readonly balance: bigint,
    /**
     * Backlink.
     * @private
     */
    private readonly _backlink: Uint8Array,
    /**
     * Timeout.
     */
    public readonly timeout: bigint,
    /**
     * Is locked.
     */
    public readonly locked: boolean,
  ) {
    this.balance = BigInt(this.balance);
    this.timeout = BigInt(this.timeout);
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * Backlink.
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  /**
   * Create fee credit record from DTO.
   */
  public static create(data: IFeeCreditRecordDto): FeeCreditRecord {
    return new FeeCreditRecord(
      BigInt(data.Balance),
      Base64Converter.decode(data.Backlink),
      BigInt(data.Timeout),
      Boolean(Number(data.Locked)),
    );
  }

  /**
   * Fee credit record to string.
   */
  public toString(): string {
    return dedent`
      FeeCreditRecord
        Balance: ${this.balance}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Timeout: ${this.timeout}
        Locked: ${this.locked}`;
  }
}
