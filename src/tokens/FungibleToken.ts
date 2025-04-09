import { IUnitId } from '../IUnitId.js';
import { IFungibleTokenDto } from '../json-rpc/IFungibleTokenDto.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { StateProof } from '../unit/StateProof.js';
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
   * @param {StateProof | null} stateProof State proof.
   * @param {bigint} version Version.
   * @param {IUnitId} typeId Token type ID.
   * @param {bigint} value Token value.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {bigint} counter Counter.
   * @param {bigint} minLifetime The earliest round number when this token may be deleted if the balance goes to zero.
   */
  public constructor(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    public readonly version: bigint,
    public readonly typeId: IUnitId,
    public readonly value: bigint,
    public readonly ownerPredicate: IPredicate,
    public readonly counter: bigint,
    public readonly minLifetime: bigint,
  ) {
    super(unitId, networkIdentifier, partitionIdentifier, stateProof);
    this.version = BigInt(this.version);
    this.value = BigInt(this.value);
    this.counter = BigInt(this.counter);
    this.minLifetime = BigInt(this.minLifetime);
  }

  /**
   * Create fungible token from DTO.
   * @param {IUnitId} unitId Unit id.
   * @param {number} networkIdentifier Network identifier.
   * @param {number} partitionIdentifier Partition identifier.
   * @param {StateProof | null} stateProof State proof.
   * @param {IFungibleTokenDto} data Fungible token DTO.
   * @returns {FungibleToken} Fungible token.
   */
  public static create(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    data: IFungibleTokenDto,
  ): FungibleToken {
    return new FungibleToken(
      unitId,
      networkIdentifier,
      partitionIdentifier,
      stateProof,
      BigInt(data.version),
      UnitId.fromBytes(Base16Converter.decode(data.typeId)),
      BigInt(data.value),
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
      FungibleToken
        Unit ID: ${this.unitId.toString()}
        Network ID: ${this.networkIdentifier}
        Partition ID: ${this.partitionIdentifier}
        Version: ${this.version}
        Type ID: ${this.typeId.toString()}
        Value: ${this.value}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Counter: ${this.counter}
        Minimum Lifetime: ${this.minLifetime}`;
  }
}
