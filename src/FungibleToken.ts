import { IUnitId } from './IUnitId.js';
import { IFungibleTokenDto } from './json-rpc/IFungibleTokenDto.js';
import { UnitId } from './UnitId.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

/**
 * Fungible token.
 */
export class FungibleToken {
  /**
   * Fungible token constructor.
   * @param {IUnitId} tokenType Token type.
   * @param {bigint} value Token value.
   * @param {bigint} blockNumber Block number.
   * @param {Uint8Array} _backlink Backlink.
   * @param {boolean} locked Is token locked.
   */
  public constructor(
    public readonly tokenType: IUnitId,
    public readonly value: bigint,
    public readonly blockNumber: bigint,
    private readonly _backlink: Uint8Array,
    public readonly locked: boolean,
  ) {
    this.value = BigInt(this.value);
    this.blockNumber = BigInt(this.blockNumber);
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * Get backlink.
   * @returns {Uint8Array} Backlink.
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  /**
   * Create fungible token from DTO.
   * @param {IFungibleTokenDto} data Fungible token data.
   * @returns {FungibleToken} Fungible token.
   */
  public static create(data: IFungibleTokenDto): FungibleToken {
    return new FungibleToken(
      UnitId.fromBytes(Base16Converter.decode(data.TokenType)),
      BigInt(data.Value),
      BigInt(data.T),
      Base64Converter.decode(data.Backlink),
      Boolean(Number(data.Locked)),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      FungibleToken
        Token Type: ${this.tokenType.toString()}
        Value: ${this.value}
        Block Number: ${this.blockNumber}
        Backlink: ${Base16Converter.encode(this._backlink)}
        Locked: ${this.locked}`;
  }
}
