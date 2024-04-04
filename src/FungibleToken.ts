import { IUnitId } from './IUnitId.js';
import { IFungibleTokenDto } from './json-rpc/IFungibleTokenDto.js';
import { UnitId } from './UnitId.js';
import { Base16Converter } from './util/Base16Converter.js';
import { Base64Converter } from './util/Base64Converter.js';
import { dedent } from './util/StringUtils.js';

export class FungibleToken {
  public constructor(
    private readonly tokenType: IUnitId,
    private readonly value: bigint,
    private readonly blockNumber: bigint,
    private readonly backlink: Uint8Array,
    private readonly locked: boolean,
  ) {
    this.value = BigInt(this.value);
    this.blockNumber = BigInt(this.blockNumber);
    this.backlink = new Uint8Array(this.backlink);
  }

  public getTokenType(): IUnitId {
    return this.tokenType;
  }

  public getValue(): bigint {
    return this.value;
  }

  public getBlockNumber(): bigint {
    return this.blockNumber;
  }

  public getBacklink(): Uint8Array {
    return new Uint8Array(this.backlink);
  }

  public isLocked(): boolean {
    return this.locked;
  }

  public static create(data: IFungibleTokenDto): FungibleToken {
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
