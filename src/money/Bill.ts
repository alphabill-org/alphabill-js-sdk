import { IUnitId } from '../IUnitId.js';
import { IBillDataDto } from '../json-rpc/IBillDataDto.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { StateProof } from '../unit/StateProof.js';
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
   * @param {StateProof | null} stateProof State proof.
   * @param {bigint} version Version.
   * @param {bigint} value Bill value.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {bigint} counter Counter.
   */
  public constructor(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    public readonly version: bigint,
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly counter: bigint,
  ) {
    super(unitId, networkIdentifier, partitionIdentifier, stateProof);
    this.version = BigInt(this.version);
    this.value = BigInt(this.value);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create bill from DTO.
   * @param {IUnitId} unitId Unit ID.
   * @param {number} networkIdentifier Network identifier.
   * @param {number} partitionIdentifier Partition identifier.
   * @param {StateProof | null} stateProof State proof.
   * @param {IBillDataDto} data Bill DTO.
   * @returns {Bill} Bill.
   */
  public static create(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    data: IBillDataDto,
  ): Bill {
    return new Bill(
      unitId,
      networkIdentifier,
      partitionIdentifier,
      stateProof,
      BigInt(data.version),
      BigInt(data.value),
      new PredicateBytes(Base16Converter.decode(data.ownerPredicate)),
      BigInt(data.counter),
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
        Version: ${this.version}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Value: ${this.value}
        Counter: ${this.counter}`;
  }
}
