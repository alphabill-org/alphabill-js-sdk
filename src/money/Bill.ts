import { IStateProof, IUnit } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { IBillDataDto } from '../json-rpc/IBillDataDto.js';
import { createStateProof } from '../json-rpc/StateProofFactory.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';

/**
 * Bill.
 */
export class Bill implements IUnit {
  /**
   * Bill constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {bigint} value Bill value.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {boolean} locked Is locked.
   * @param {bigint} counter Counter.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly locked: bigint,
    public readonly counter: bigint,
    public readonly stateProof: IStateProof | null,
  ) {
    this.value = BigInt(this.value);
    this.locked = BigInt(this.locked);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create bill from DTO.
   * @param {IFungibleTokenTypeDto} input Data.
   * @returns {Bill} Bill.
   */
  public static create({ unitId, ownerPredicate, data, stateProof }: IBillDataDto): Bill {
    return new Bill(
      UnitId.fromBytes(Base16Converter.decode(unitId)),
      BigInt(data.value),
      new PredicateBytes(Base16Converter.decode(ownerPredicate)),
      BigInt(data.locked),
      BigInt(data.counter),
      stateProof ? createStateProof(stateProof) : null,
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
        Locked: ${this.locked}
        Counter: ${this.counter}`;
  }
}
