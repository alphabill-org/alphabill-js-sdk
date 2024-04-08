import { IUnitId } from './IUnitId.js';
import { INonFungibleTokenDto } from './json-rpc/INonFungibleTokenDto.js';
import { PredicateBytes } from './PredicateBytes.js';
import { IPredicate } from './transaction/IPredicate.js';
import { UnitId } from './UnitId.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

/**
 * Non-fungible token.
 */
export class NonFungibleToken {
  /**
   * Non-fungible token constructor.
   * @param {IUnitId} tokenType Token type.
   * @param {string} name Token name.
   * @param {string} uri Token URI.
   * @param {Uint8Array} _data Token data.
   * @param {IPredicate} dataUpdatePredicate Data update predicate.
   * @param {bigint} blockNumber Block number.
   * @param {Uint8Array} _backlink Backlink.
   * @param {boolean} locked Is token locked.
   */
  public constructor(
    /**
     * Type.
     */
    public readonly tokenType: IUnitId,
    /**
     * Name.
     */
    public readonly name: string,
    /**
     * URI.
     */
    public readonly uri: string,
    /**
     * User data.
     * @private
     */
    private readonly _data: Uint8Array,
    /**
     * Data update predicate.
     */
    public readonly dataUpdatePredicate: IPredicate,
    /**
     * Block number.
     */
    public readonly blockNumber: bigint,
    /**
     * Backlink.
     * @private
     */
    private readonly _backlink: Uint8Array,
    /**
     * Is locked.
     */
    public readonly locked: boolean,
  ) {
    this._data = new Uint8Array(this._data);
    this.blockNumber = BigInt(this.blockNumber);
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * User data.
   * @returns {Uint8Array} User data.
   */
  public get data(): Uint8Array {
    return new Uint8Array(this._data);
  }

  /**
   * Backlink.
   * @returns {Uint8Array} Backlink.
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  /**
   * Create non-fungible token from DTO.
   * @param {INonFungibleTokenDto} data Non-fungible token data.
   * @returns {NonFungibleToken} Non-fungible token.
   */
  public static create(data: INonFungibleTokenDto): NonFungibleToken {
    return new NonFungibleToken(
      UnitId.fromBytes(Base16Converter.decode(data.NftType)),
      data.Name,
      data.URI,
      Base64Converter.decode(data.Data),
      new PredicateBytes(Base64Converter.decode(data.DataUpdatePredicate)),
      BigInt(data.T),
      Base64Converter.decode(data.Backlink),
      Boolean(Number(data.Locked)),
    );
  }

  /**
   * Non-fungible token to string.
   * @returns {string}
   */
  public toString(): string {
    return dedent`
      NonFungibleToken
        Token Type: ${this.tokenType.toString()}
        Name: ${this.name}
        URI: ${this.uri}
        Data: ${Base16Converter.encode(this._data)}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Block Number: ${this.blockNumber}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Locked: ${this.locked}`;
  }
}
