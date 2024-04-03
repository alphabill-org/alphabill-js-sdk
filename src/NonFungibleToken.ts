import { IUnitId } from './IUnitId.js';
import { INonFungibleTokenDto } from './json-rpc/INonFungibleTokenDto.js';
import { PredicateBytes } from './PredicateBytes.js';
import { IPredicate } from './transaction/IPredicate.js';
import { UnitId } from './UnitId.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

export class NonFungibleToken {
  public constructor(
    public readonly tokenType: IUnitId,
    public readonly name: string,
    public readonly uri: string,
    public readonly data: Uint8Array,
    public readonly dataUpdatePredicate: IPredicate,
    public readonly blockNumber: bigint,
    public readonly backlink: Uint8Array,
    public readonly locked: boolean,
  ) {
    this.data = new Uint8Array(this.data);
    this.blockNumber = BigInt(this.blockNumber);
    this.backlink = new Uint8Array(this.backlink);
  }

  public static async create(data: INonFungibleTokenDto): Promise<NonFungibleToken> {
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

  public toString(): string {
    return dedent`
      NonFungibleToken
        Token Type: ${this.tokenType.toString()}
        Name: ${this.name}
        URI: ${this.uri}
        Data: ${Base16Converter.encode(this.data)}
        Data Update Predicate: ${this.dataUpdatePredicate.toString()}
        Block Number: ${this.blockNumber}
        Backlink: ${Base16Converter.encode(this.backlink)}
        Locked: ${this.locked}`;
  }
}
