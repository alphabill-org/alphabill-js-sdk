import { IStateProof } from '../IStateProof.js';
import { IUnitId } from '../IUnitId.js';
import { IFeeCreditRecordDto } from '../json-rpc/IFeeCreditRecordDto.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { Unit } from '../Unit.js';
import { Base64Converter } from '../util/Base64Converter.js';
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
   * @param {IStateProof | null} stateProof State proof.
   * @param {bigint} balance Fee credit balance.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {bigint} locked Is fee credit locked.
   * @param {bigint} counter Fee credit counter.
   * @param {bigint} timeout Fee credit timeout.
   */
  public constructor(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: IStateProof | null,
    public readonly balance: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly locked: bigint,
    public readonly counter: bigint,
    public readonly timeout: bigint,
  ) {
    super(unitId, networkIdentifier, partitionIdentifier, stateProof);
    this.balance = BigInt(this.balance);
    this.locked = BigInt(this.locked);
    this.counter = BigInt(this.counter);
    this.timeout = BigInt(this.timeout);
  }

  /**
   * Create fee credit record from DTO.
   * Create non-fungible token type from DTO.
   * @param {IUnitId} unitId Unit id.
   * @param {number} networkIdentifier Network identifier.
   * @param {number} partitionIdentifier Partition identifier.
   * @param {IStateProof | null} stateProof State proof.
   * @param {IFeeCreditRecordDto} data Fee credit DTO.
   * @returns {FeeCreditRecord} Fee credit record.
   */
  public static create(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: IStateProof | null,
    data: IFeeCreditRecordDto,
  ): FeeCreditRecord {
    return new FeeCreditRecord(
      unitId,
      networkIdentifier,
      partitionIdentifier,
      stateProof,
      BigInt(data.balance),
      new PredicateBytes(Base64Converter.decode(data.ownerPredicate)),
      BigInt(data.locked),
      BigInt(data.counter),
      BigInt(data.timeout),
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
        Balance: ${this.balance}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Locked: ${this.locked}
        Counter: ${this.counter}
        Timeout: ${this.timeout}`;
  }
}
