import { IStateProof } from '../IUnit.js';
import { IUnitId } from '../IUnitId.js';
import { INonFungibleTokenDto } from '../json-rpc/INonFungibleTokenDto.js';
import { IPredicate } from '../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../transaction/predicates/PredicateBytes.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { Base64Converter } from '../util/Base64Converter.js';
import { dedent } from '../util/StringUtils.js';
import { createStateProof } from '../json-rpc/StateProofFactory.js';

/**
 * Non-fungible token.
 */
export class NonFungibleToken {
  /**
   * Non-fungible token constructor.
   * @param {IUnitId} unitId Unit ID.
   * @param {IUnitId} tokenType Token type.
   * @param {string} name Token name.
   * @param {string} uri Token URI.
   * @param {Uint8Array} _data Token data.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {IPredicate} dataUpdatePredicate Data update predicate.
   * @param {bigint} locked Is token locked.
   * @param {bigint} counter Counter.
   * @param {IStateProof | null} stateProof State proof.
   */
  public constructor(
    public readonly unitId: IUnitId,
    public readonly tokenType: IUnitId,
    public readonly name: string,
    public readonly uri: string,
    private readonly _data: Uint8Array,
    public readonly ownerPredicate: IPredicate,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly locked: bigint,
    public readonly counter: bigint,
    public readonly stateProof: IStateProof | null,
  ) {
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
   * @param {IFungibleTokenTypeDto} input Data.
   * @returns {NonFungibleToken} Non-fungible token.
   */
  public static create({ unitId, ownerPredicate, data, stateProof }: INonFungibleTokenDto): NonFungibleToken {
    return new NonFungibleToken(
      UnitId.fromBytes(Base16Converter.decode(unitId)),
      UnitId.fromBytes(Base16Converter.decode(data.typeID)),
      data.name,
      data.uri,
      Base64Converter.decode(data.data),
      new PredicateBytes(Base16Converter.decode(ownerPredicate)),
      new PredicateBytes(Base64Converter.decode(data.dataUpdatePredicate)),
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
      NonFungibleToken
        Unit ID: ${this.unitId.toString()}
        Token Type: ${this.tokenType.toString()}
        Name: ${this.name}
        URI: ${this.uri}
        Data: ${Base16Converter.encode(this._data)}
        Owner Predicate: ${this.ownerPredicate.toString()}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Locked: ${this.locked}
        Counter: ${this.counter}`;
  }
}
