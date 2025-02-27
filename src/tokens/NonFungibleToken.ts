import { IUnitId } from '../IUnitId.js';
import { INonFungibleTokenDto } from '../json-rpc/INonFungibleTokenDto.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { StateProof } from '../unit/StateProof.js';
import { Unit } from '../Unit.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';

/**
 * Non-fungible token.
 */
export class NonFungibleToken extends Unit {
  /**
   * Non-fungible token constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {number} networkIdentifier Network ID.
   * @param {number} partitionIdentifier Partition ID.
   * @param {StateProof | null} stateProof State proof.
   * @param {bigint} version Version.
   * @param {IUnitId} typeId Token type ID.
   * @param {string | null} name Token name.
   * @param {string | null} uri Token URI.
   * @param {Uint8Array | null} _data Token data.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {IPredicate} dataUpdatePredicate Data update predicate.
   * @param {bigint} locked Is token locked.
   * @param {bigint} counter Counter.
   */
  public constructor(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    public readonly version: bigint,
    public readonly typeId: IUnitId,
    public readonly name: string | null,
    public readonly uri: string | null,
    private readonly _data: Uint8Array | null,
    public readonly ownerPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly locked: bigint,
    public readonly counter: bigint,
  ) {
    super(unitId, networkIdentifier, partitionIdentifier, stateProof);
    this.version = BigInt(this.version);
    this._data = this._data ? new Uint8Array(this._data) : null;
    this.locked = BigInt(this.locked);
    this.counter = BigInt(this.counter);
  }

  /**
   * Get user data.
   * @returns {Uint8Array | null} User data.
   */
  public get data(): Uint8Array | null {
    return this._data ? new Uint8Array(this._data) : null;
  }

  /**
   * Create non-fungible token from DTO.
   * @param {IUnitId} unitId Unit id.
   * @param {number} networkIdentifier Network identifier.
   * @param {number} partitionIdentifier Partition identifier.
   * @param {StateProof | null} stateProof State proof.
   * @param {INonFungibleTokenDto} data Non-fungible token DTO.
   * @returns {NonFungibleToken} Non-fungible token.
   */
  public static create(
    unitId: IUnitId,
    networkIdentifier: number,
    partitionIdentifier: number,
    stateProof: StateProof | null,
    data: INonFungibleTokenDto,
  ): NonFungibleToken {
    return new NonFungibleToken(
      unitId,
      networkIdentifier,
      partitionIdentifier,
      stateProof,
      data.version,
      UnitId.fromBytes(Base16Converter.decode(data.typeId)),
      data.name,
      data.uri,
      data.data ? Base16Converter.decode(data.data) : null,
      new PredicateBytes(Base16Converter.decode(data.ownerPredicate)),
      new PredicateBytes(Base16Converter.decode(data.dataUpdatePredicate)),
      BigInt(data.locked),
      BigInt(data.counter),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      NonFungibleToken
        Unit ID: ${this.unitId.toString()}
        Network ID: ${this.networkIdentifier}
        Partition ID: ${this.partitionIdentifier}
        Version: ${this.version}
        Type ID: ${this.typeId.toString()}
        Name: ${this.name}
        URI: ${this.uri}
        Data: ${this._data ? Base16Converter.encode(this._data) : null}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Locked: ${this.locked}
        Counter: ${this.counter}`;
  }
}
