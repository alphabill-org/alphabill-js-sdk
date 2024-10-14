import { IStateProof, IUnit } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { IBillDataDto } from '../json-rpc/IBillDataDto.js';
import { IPredicate } from '../transaction/predicate/IPredicate.js';
import { dedent } from '../util/StringUtils.js';
import { Base16Converter } from '../util/Base16Converter';

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
   * @param {bigint} counter Counter.
   * @param {boolean} locked Is locked.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly ownerPredicate: IPredicate,
    public readonly value: bigint,
    public readonly lastUpdate: bigint,
    public readonly counter: bigint,
    public readonly locked: boolean,
    public readonly stateProof: IStateProof | null,
  ) {
    this.value = BigInt(this.value);
    this.lastUpdate = BigInt(this.lastUpdate);
    this.counter = BigInt(this.counter);
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
      BigInt(data.counter),
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
        UnitId: ${this.unitId.toString()}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Value: ${this.value}
        Last Update: ${this.lastUpdate}
        Counter: ${this.counter}
        Locked: ${this.locked}`;
  }
}
