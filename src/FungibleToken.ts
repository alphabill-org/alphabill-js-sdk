import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { IFungibleTokenDto } from './json-rpc/IFungibleTokenDto.js';
import { IUnitId } from './IUnitId.js';
import { UnitFactory } from './json-rpc/UnitFactory.js';

export class FungibleToken {
  public constructor(
    public readonly tokenType: IUnitId,
    public readonly value: bigint,
    public readonly blockNumber: bigint,
    public readonly backlink: Uint8Array,
    public readonly locked: boolean,
  ) {}

  public static async Create(data: IFungibleTokenDto): Promise<FungibleToken> {
    return new FungibleToken(
      UnitFactory.createUnitIdFromBytes(Base16Converter.decode(data.TokenType)),
      BigInt(data.Value),
      BigInt(data.T),
      Base64Converter.decode(data.Backlink),
      Boolean(Number(data.Locked)),
    );
  }
}
