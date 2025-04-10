import { IUnitId } from '../IUnitId.js';
import { IFeeCreditRecordDto } from '../json-rpc/IFeeCreditRecordDto.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { StateProof } from '../unit/StateProof.js';
import { Unit } from '../Unit.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';

/**
 * Fee credit record.
 */
export class FeeCreditRecord extends Unit {
  /**
   * Fee credit record constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {number} networkIdentifier Network ID.
   * @param {number} partitionIdentifier Partition ID.
   * @param {StateProof | null} stateProof State proof.
   * @param {bigint} version Version.
   * @param {bigint} balance Fee credit balance.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {bigint} counter Fee credit counter.
   * @param {bigint} minLifetime The earliest round number when this record may be deleted if the balance goes to zero.
   */
  public constructor(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    public readonly version: bigint,
    public readonly balance: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly counter: bigint,
    public readonly minLifetime: bigint,
  ) {
    super(unitId, networkIdentifier, partitionIdentifier, stateProof);
    this.version = BigInt(this.version);
    this.balance = BigInt(this.balance);
    this.counter = BigInt(this.counter);
    this.minLifetime = BigInt(this.minLifetime);
  }

  /**
   * Create fee credit record from DTO.
   * Create non-fungible token type from DTO.
   * @param {IUnitId} unitId Unit id.
   * @param {number} networkIdentifier Network identifier.
   * @param {number} partitionIdentifier Partition identifier.
   * @param {StateProof | null} stateProof State proof.
   * @param {IFeeCreditRecordDto} data Fee credit DTO.
   * @returns {FeeCreditRecord} Fee credit record.
   */
  public static create(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    data: IFeeCreditRecordDto,
  ): FeeCreditRecord {
    return new FeeCreditRecord(
      unitId,
      networkIdentifier,
      partitionIdentifier,
      stateProof,
      BigInt(data.version),
      BigInt(data.balance),
      new PredicateBytes(Base16Converter.decode(data.ownerPredicate)),
      BigInt(data.counter),
      BigInt(data.minLifetime),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      FeeCreditRecord
        Unit ID: ${this.unitId.toString()} 
        Network ID: ${this.networkIdentifier}
        Partition ID: ${this.partitionIdentifier}
        Version: ${this.version}
        Balance: ${this.balance}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Counter: ${this.counter}
        Minimum Lifetime: ${this.minLifetime}`;
  }
}
