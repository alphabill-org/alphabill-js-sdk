import { IUnitId } from './IUnitId.js';
import { IFungibleTokenDto } from './json-rpc/IFungibleTokenDto.js';
import { UnitId } from './UnitId.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

export class FungibleToken {
  public constructor(
    public readonly tokenType: IUnitId,
    public readonly value: bigint,
    public readonly blockNumber: bigint,
    public readonly backlink: Uint8Array,
    public readonly locked: boolean,
  ) {
    this.value = BigInt(this.value);
    this.blockNumber = BigInt(this.blockNumber);
    this.backlink = new Uint8Array(this.backlink);
  }

  public static async create(data: IFungibleTokenDto): Promise<FungibleToken> {
    return new FungibleToken(
      UnitId.fromBytes(Base16Converter.decode(data.TokenType)),
      BigInt(data.Value),
      BigInt(data.T),
      Base64Converter.decode(data.Backlink),
      Boolean(Number(data.Locked)),
    );
  }

  public toString(): string {
    return dedent`
      FungibleToken
        Token Type: ${this.tokenType.toString()}
        Value: ${this.value}
        Block Number: ${this.blockNumber}
        Backlink: ${Base16Converter.encode(this.backlink)}
        Locked: ${this.locked}`;
  }
}
