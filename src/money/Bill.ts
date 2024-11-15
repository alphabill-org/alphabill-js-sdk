import { IStateProof } from '../IStateProof.js';
import { IUnitId } from '../IUnitId.js';
import { IBillDataDto } from '../json-rpc/IBillDataDto.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { Unit } from '../Unit.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';

/**
 * Bill.
 */
export class Bill extends Unit {
  /**
   * Bill constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {number} networkIdentifier Network ID.
   * @param {number} partitionIdentifier Partition ID.
   * @param {bigint} value Bill value.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {boolean} locked Is locked.
   * @param {bigint} counter Counter.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly locked: bigint,
    public readonly counter: bigint,
    stateProof: IStateProof | null,
  ) {
    super(unitId, networkIdentifier, partitionIdentifier, stateProof);
    this.value = BigInt(this.value);
    this.locked = BigInt(this.locked);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create bill from DTO.
   * @param {IUnitId} unitId
   * @param {number} networkIdentifier
   * @param {number} partitionIdentifier
   * @param {IBillDataDto} input Data.
   * @param {IStateProof | null} stateProof
   * @returns {Bill} Bill.

   */
  public static create(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    { value, ownerPredicate, locked, counter }: IBillDataDto,
    stateProof: IStateProof | null,
  ): Bill {
    return new Bill(
      unitId,
      networkIdentifier,
      partitionIdentifier,
      BigInt(value),
      new PredicateBytes(Base16Converter.decode(ownerPredicate)),
      BigInt(locked),
      BigInt(counter),
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
        Unit ID: ${this.unitId.toString()} 
        Network ID: ${this.networkIdentifier} 
        Partition ID: ${this.partitionIdentifier} 
        Owner Predicate: ${this.ownerPredicate.toString()}
        Value: ${this.value}
        Locked: ${this.locked}
        Counter: ${this.counter}`;
  }
}
