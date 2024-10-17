import { IStateProof } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { IFungibleTokenDto } from '../json-rpc/IFungibleTokenDto.js';
import { createStateProof } from '../json-rpc/StateProofFactory.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { Base64Converter } from '../util/Base64Converter.js';
import { dedent } from '../util/StringUtils.js';

/**
 * Fungible token.
 */
export class FungibleToken {
  /**
   * Fungible token constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {IUnitId} tokenType Token type.
   * @param {bigint} value Token value.
   * @param {bigint} counter Counter.
   * @param {bigint} locked Is token locked.
   * @param {bigint} timeout The earliest round number when this token may be deleted if the balance goes to zero.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly tokenType: IUnitId,
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly locked: bigint,
    public readonly counter: bigint,
    public readonly timeout: bigint,
    public readonly stateProof: IStateProof | null,
  ) {
    this.value = BigInt(this.value);
    this.locked = BigInt(this.locked);
    this.counter = BigInt(this.counter);
    this.timeout = BigInt(this.timeout);
  }

  /**
   * Create fungible token from DTO.
   * @param {IFungibleTokenDto} input Data.
   * @returns {FungibleToken} Fungible token.
   */
  public static create({ unitId, data, stateProof }: IFungibleTokenDto): FungibleToken {
    return new FungibleToken(
      UnitId.fromBytes(Base16Converter.decode(unitId)),
      UnitId.fromBytes(Base16Converter.decode(data.tokenType)),
      BigInt(data.value),
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
      FungibleToken
        Unit ID: ${this.unitId.toString()}
        Token Type: ${this.tokenType.toString()}
        Value: ${this.value}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Locked: ${this.locked}
        Counter: ${this.counter}
        Timeout: ${this.timeout}`;
  }
}
