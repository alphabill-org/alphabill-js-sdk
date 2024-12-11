import { IStateProof } from '../IStateProof.js';
import { IUnitId } from '../IUnitId.js';
import { IFungibleTokenDto } from '../json-rpc/IFungibleTokenDto.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { Unit } from '../Unit.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';

/**
 * Fungible token.
 */
export class FungibleToken extends Unit {
  /**
   * Fungible token constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {number} networkIdentifier Network ID.
   * @param {number} partitionIdentifier Partition ID.
   * @param {IStateProof | null} stateProof State proof.
   * @param {IUnitId} tokenType Token type.
   * @param {bigint} value Token value.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {bigint} counter Counter.
   * @param {bigint} locked Is token locked.
   * @param {bigint} minLifetime The earliest round number when this token may be deleted if the balance goes to zero.
   */
  public constructor(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: IStateProof | null,
    public readonly tokenType: IUnitId,
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly locked: bigint,
    public readonly counter: bigint,
    public readonly minLifetime: bigint,
  ) {
    super(unitId, networkIdentifier, partitionIdentifier, stateProof);
    this.value = BigInt(this.value);
    this.locked = BigInt(this.locked);
    this.counter = BigInt(this.counter);
    this.minLifetime = BigInt(this.minLifetime);
  }

  /**
   * Create fungible token from DTO.
   * @param {IUnitId} unitId Unit id.
   * @param {number} networkIdentifier Network identifier.
   * @param {number} partitionIdentifier Partition identifier.
   * @param {IStateProof | null} stateProof State proof.
   * @param {IFungibleTokenDto} data Fungible token DTO.
   * @returns {FungibleToken} Fungible token.
   */
  public static create(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: IStateProof | null,
    data: IFungibleTokenDto,
  ): FungibleToken {
    return new FungibleToken(
      unitId,
      networkIdentifier,
      partitionIdentifier,
      stateProof,
      UnitId.fromBytes(Base16Converter.decode(data.tokenType)),
      BigInt(data.value),
      new PredicateBytes(Base16Converter.decode(data.ownerPredicate)),
      BigInt(data.locked),
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
      FungibleToken
        Unit ID: ${this.unitId.toString()}
        Network ID: ${this.networkIdentifier}
        Partition ID: ${this.partitionIdentifier}
        Token Type: ${this.tokenType.toString()}
        Value: ${this.value}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Locked: ${this.locked}
        Counter: ${this.counter}
        Minimum Lifetime: ${this.minLifetime}`;
  }
}
