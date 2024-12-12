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
   * @param {IUnitId} typeId Token type ID.
   * @param {string} name Token name.
   * @param {string} uri Token URI.
   * @param {Uint8Array} _data Token data.
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
    public readonly typeId: IUnitId,
    public readonly name: string,
    public readonly uri: string,
    private readonly _data: Uint8Array,
    public readonly ownerPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly locked: bigint,
    public readonly counter: bigint,
  ) {
    super(unitId, networkIdentifier, partitionIdentifier, stateProof);
    this._data = new Uint8Array(this._data);
    this.locked = BigInt(this.locked);
    this.counter = BigInt(this.counter);
  }

  /**
   * Get user data.
   * @returns {Uint8Array} User data.
   */
  public get data(): Uint8Array {
    return new Uint8Array(this._data);
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
      UnitId.fromBytes(Base16Converter.decode(data.typeId)),
      data.name,
      data.uri,
      Base16Converter.decode(data.data),
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
        Type ID: ${this.typeId.toString()}
        Name: ${this.name}
        URI: ${this.uri}
        Data: ${Base16Converter.encode(this._data)}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Locked: ${this.locked}
        Counter: ${this.counter}`;
  }
}
