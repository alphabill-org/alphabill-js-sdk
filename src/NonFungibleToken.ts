import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { INonFungibleTokenDto } from './json-rpc/INonFungibleTokenDto.js';
import { IUnitId } from './IUnitId.js';
import { UnitFactory } from './json-rpc/UnitFactory.js';

export class NonFungibleToken {
  public constructor(
    public readonly tokenType: IUnitId,
    public readonly name: string,
    public readonly uri: string,
    public readonly data: Uint8Array,
    public readonly dataUpdatePredicate: Uint8Array,
    public readonly blockNumber: bigint,
    public readonly backlink: Uint8Array,
    public readonly locked: boolean,
  ) {}

  public static async Create(data: INonFungibleTokenDto): Promise<NonFungibleToken> {
    return new NonFungibleToken(
      UnitFactory.createUnitIdFromBytes(Base16Converter.decode(data.NftType)),
      data.Name,
      data.URI,
      Base64Converter.decode(data.Data),
      Base64Converter.decode(data.DataUpdatePredicate),
      BigInt(data.T),
      Base64Converter.decode(data.Backlink),
      Boolean(Number(data.Locked)),
    );
  }
}
