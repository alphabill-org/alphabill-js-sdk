import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { INonFungibleTokenData } from './INonFungibleTokenData.js';

export class NonFungibleTokenData implements INonFungibleTokenData {
  private constructor(private readonly data: Uint8Array) {}

  public static async Create(cborCodec: ICborCodec, data: unknown): Promise<NonFungibleTokenData> {
    return new NonFungibleTokenData(await cborCodec.encode(data));
  }

  public static CreateFromBytes(data: Uint8Array): NonFungibleTokenData {
    return new NonFungibleTokenData(data);
  }

  public static async Parse(cborCodec: ICborCodec, data: Uint8Array): Promise<unknown> {
    return cborCodec.decode(data);
  }

  public getBytes(): Uint8Array {
    return new Uint8Array(this.data);
  }

  public toString(): string {
    return dedent`${Base16Converter.encode(this.data)}`;
  }
}
