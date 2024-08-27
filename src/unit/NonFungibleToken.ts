import { IStateProof } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { INonFungibleTokenDto } from '../json-rpc/INonFungibleTokenDto.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { IPredicate } from '../transaction/IPredicate.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { Base64Converter } from '../util/Base64Converter.js';
import { dedent } from '../util/StringUtils.js';

/**
 * Non-fungible token.
 */
export class NonFungibleToken {
  /**
   * Non-fungible token constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {IUnitId} tokenType Token type.
   * @param {string} name Token name.
   * @param {string} uri Token URI.
   * @param {Uint8Array} _data Token data.
   * @param {IPredicate} dataUpdatePredicate Data update predicate.
   * @param {bigint} lastUpdate Round number of the last transaction with this token.
   * @param {bigint} counter Counter.
   * @param {boolean} locked Is token locked.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly ownerPredicate: IPredicate,
    public readonly tokenType: IUnitId,
    public readonly name: string,
    public readonly uri: string,
    private readonly _data: Uint8Array,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly lastUpdate: bigint,
    public readonly counter: bigint,
    public readonly locked: boolean,
    public readonly stateProof: IStateProof | null,
  ) {
    this._data = new Uint8Array(this._data);
    this.lastUpdate = BigInt(this.lastUpdate);
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
   * @param {IUnitId} unitId Unit ID.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {INonFungibleTokenDto} data Non-fungible token data.
   * @param {IStateProof | null} stateProof State proof.
   * @returns {NonFungibleToken} Non-fungible token.
   */
  public static create(
    unitId: IUnitId,
    ownerPredicate: IPredicate,
    data: INonFungibleTokenDto,
    stateProof: IStateProof | null,
  ): NonFungibleToken {
    return new NonFungibleToken(
      unitId,
      ownerPredicate,
      UnitId.fromBytes(Base16Converter.decode(data.typeID)),
      data.name,
      data.uri,
      Base64Converter.decode(data.data),
      new PredicateBytes(Base64Converter.decode(data.dataUpdatePredicate)),
      BigInt(data.lastUpdate),
      BigInt(data.counter),
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
      NonFungibleToken
        Unit ID: ${this.unitId.toString()}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Token Type: ${this.tokenType.toString()}
        Name: ${this.name}
        URI: ${this.uri}
        Data: ${Base16Converter.encode(this._data)}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Last Update: ${this.lastUpdate}
        Counter: ${this.counter}
        Locked: ${this.locked}`;
  }
}
