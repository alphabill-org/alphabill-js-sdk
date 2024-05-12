import { IStateProof, IUnit } from './IUnit.js';
import { IUnitId } from './IUnitId.js';
import { IBillDataDto } from './json-rpc/IBillDataDto.js';
import { IPredicate } from './transaction/IPredicate.js';
import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

/**
 * Bill.
 */
export class Bill implements IUnit {
  /**
   * Bill constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {bigint} value Bill value.
   * @param {bigint} lastUpdate Last update.
   * @param {Uint8Array} _backlink Backlink.
   * @param {boolean} locked Is locked.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly ownerPredicate: IPredicate,
    public readonly value: bigint,
    public readonly lastUpdate: bigint,
    private readonly _backlink: Uint8Array,
    public readonly locked: boolean,
    public readonly stateProof: IStateProof | null,
  ) {
    this.value = BigInt(this.value);
    this.lastUpdate = BigInt(this.lastUpdate);
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * Get backlink.
   * @returns {Uint8Array}
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  /**
   * Create bill from DTO.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {IBillDataDto} data Bill data.
   * @param {IStateProof} stateProof State proof.
   * @returns {Bill} Bill.
   */
  public static create(
    unitId: IUnitId,
    ownerPredicate: IPredicate,
    data: IBillDataDto,
    stateProof: IStateProof | null,
  ): Bill {
    return new Bill(
      unitId,
      ownerPredicate,
      BigInt(data.value),
      BigInt(data.lastUpdate),
      Base16Converter.decode(data.backlink),
      Boolean(Number(data.locked)),
      stateProof,
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
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
