import { IBillDataDto } from './json-rpc/IBillDataDto.js';
import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

/**
 * Bill.
 */
export class Bill {
  /**
   * Bill constructor.
   * @param {bigint} value Bill value.
   * @param {bigint} lastUpdate Last update.
   * @param {Uint8Array} _backlink Backlink.
   * @param {boolean} locked Is locked.
   */
  public constructor(
    /**
     * Value.
     */
    public readonly value: bigint,
    /**
     * Last update.
     */
    public readonly lastUpdate: bigint,
    /**
     * Backlink.
     * @private
     */
    private readonly _backlink: Uint8Array,
    /**
     * Is locked.
     */
    public readonly locked: boolean,
  ) {
    this.value = BigInt(this.value);
    this.lastUpdate = BigInt(this.lastUpdate);
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * Backlink.
   * @returns {Uint8Array}
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  /**
   * Create bill from DTO.
   * @param {IBillDataDto} data Bill data.
   * @returns {Bill} Bill.
   */
  public static create(data: IBillDataDto): Bill {
    return new Bill(
      BigInt(data.value),
      BigInt(data.lastUpdate),
      Base16Converter.decode(data.backlink),
      Boolean(Number(data.locked)),
    );
  }

  /**
   * Bill to string.
   * @returns {string} Bill to string.
   */
  public toString(): string {
    return dedent`
      Bill
        Value: ${this.value}
        Last Update: ${this.lastUpdate}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Locked: ${this.locked}`;
  }
}
