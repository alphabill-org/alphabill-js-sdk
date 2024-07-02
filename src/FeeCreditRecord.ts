import { IStateProof } from './IUnit.js';
import { IUnitId } from './IUnitId.js';
import { IFeeCreditRecordDto } from './json-rpc/IFeeCreditRecordDto.js';
import { IPredicate } from './transaction/IPredicate.js';
import { dedent } from './util/StringUtils.js';

/**
 * Fee credit record.
 */
export class FeeCreditRecord {
  /**
   * Fee credit record constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {bigint} balance Fee credit balance.
   * @param {bigint} counter Fee credit counter.
   * @param {bigint} timeout Fee credit timeout.
   * @param {boolean} locked Is fee credit locked.
   * @param {IStateProof} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly ownerPredicate: IPredicate,
    public readonly balance: bigint,
    public readonly counter: bigint,
    public readonly timeout: bigint,
    public readonly locked: boolean,
    public readonly stateProof: IStateProof | null,
  ) {
    this.balance = BigInt(this.balance);
    this.timeout = BigInt(this.timeout);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create fee credit record from DTO.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {IFeeCreditRecordDto} data Fee credit record data.
   * @param {IStateProof} stateProof State proof.
   * @returns {FeeCreditRecord} Fee credit record.
   */
  public static create(
    unitId: IUnitId,
    ownerPredicate: IPredicate,
    data: IFeeCreditRecordDto,
    stateProof: IStateProof | null,
  ): FeeCreditRecord {
    return new FeeCreditRecord(
      unitId,
      ownerPredicate,
      BigInt(data.Balance),
      BigInt(data.Counter),
      BigInt(data.Timeout),
      Boolean(Number(data.Locked)),
      stateProof,
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
        Counter: ${this.counter}
        Timeout: ${this.timeout}
        Locked: ${this.locked}`;
  }
}
