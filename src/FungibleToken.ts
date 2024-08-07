import { IStateProof } from './IUnit.js';
import { IUnitId } from './IUnitId.js';
import { IFungibleTokenDto } from './json-rpc/IFungibleTokenDto.js';
import { IPredicate } from './transaction/IPredicate.js';
import { UnitId } from './UnitId.js';
import { Base16Converter } from './util/Base16Converter.js';
import { dedent } from './util/StringUtils.js';

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
   * @param {bigint} lastUpdate Round number of the last transaction with this token.
   * @param {bigint} counter Counter.
   * @param {bigint} minimumLifetime Minimum lifetime of this token.
   * @param {boolean} locked Is token locked.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly ownerPredicate: IPredicate,
    public readonly tokenType: IUnitId,
    public readonly value: bigint,
    public readonly lastUpdate: bigint,
    public readonly counter: bigint,
    public readonly minimumLifetime: bigint,
    public readonly locked: boolean,
    public readonly stateProof: IStateProof | null,
  ) {
    this.value = BigInt(this.value);
    this.lastUpdate = BigInt(this.lastUpdate);
    this.counter = BigInt(this.counter);
    this.minimumLifetime = BigInt(this.minimumLifetime);
  }

  /**
   * Create fungible token from DTO.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {IFungibleTokenDto} data Fungible token data.
   * @param {IStateProof} stateProof State proof.
   * @returns {FungibleToken} Fungible token.
   */
  public static create(
    unitId: IUnitId,
    ownerPredicate: IPredicate,
    data: IFungibleTokenDto,
    stateProof: IStateProof | null,
  ): FungibleToken {
    return new FungibleToken(
      unitId,
      ownerPredicate,
      UnitId.fromBytes(Base16Converter.decode(data.tokenType)),
      BigInt(data.value),
      BigInt(data.lastUpdate),
      BigInt(data.counter),
      BigInt(data.t1),
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
      FungibleToken
        Unit ID: ${this.unitId.toString()}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Token Type: ${this.tokenType.toString()}
        Value: ${this.value}
        Last Update: ${this.lastUpdate}
        Counter: ${this.counter}
        Minimum Lifetime: ${this.minimumLifetime}
        Locked: ${this.locked}`;
  }
}
