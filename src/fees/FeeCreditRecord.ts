import { IStateProof } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { IFeeCreditRecordDto } from '../json-rpc/IFeeCreditRecordDto.js';
import { createStateProof } from '../json-rpc/StateProofFactory.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { Base64Converter } from '../util/Base64Converter.js';

/**
 * Fee credit record.
 */
export class FeeCreditRecord {
  /**
   * Fee credit record constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {bigint} balance Fee credit balance.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {bigint} locked Is fee credit locked.
   * @param {bigint} counter Fee credit counter.
   * @param {bigint} timeout Fee credit timeout.
   * @param {IStateProof} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly balance: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly locked: bigint,
    public readonly counter: bigint,
    public readonly timeout: bigint,
    public readonly stateProof: IStateProof | null,
  ) {
    this.balance = BigInt(this.balance);
    this.locked = BigInt(this.locked);
    this.counter = BigInt(this.counter);
    this.timeout = BigInt(this.timeout);
  }

  /**
   * Create fee credit record from DTO.
   * @param {IFeeCreditRecordDto} input Data.
   * @returns {FeeCreditRecord} Fee credit record.
   */
  public static create({ unitId, data, stateProof }: IFeeCreditRecordDto): FeeCreditRecord {
    return new FeeCreditRecord(
      UnitId.fromBytes(Base16Converter.decode(unitId)),
      BigInt(data.balance),
      new PredicateBytes(Base64Converter.decode(data.ownerPredicate)),
      BigInt(data.locked),
      BigInt(data.counter),
      BigInt(data.timeout),
      stateProof ? createStateProof(stateProof) : null,
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      FeeCreditRecord
        Balance: ${this.balance}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Locked: ${this.locked}
        Counter: ${this.counter}
        Timeout: ${this.timeout}`;
  }
}
