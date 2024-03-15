import { INonFungibleTokenData } from './INonFungibleTokenData.js';
import { ICborCodec } from '../codec/cbor/ICborCodec.js';

export class NonFungibleTokenData implements INonFungibleTokenData {
  private constructor(private readonly data: Uint8Array) {}

  public static async Create(cborCodec: ICborCodec, data: unknown): Promise<NonFungibleTokenData> {
    return new NonFungibleTokenData(await cborCodec.encode(data));
  }

  public static async Parse(cborCodec: ICborCodec, data: Uint8Array): Promise<unknown> {
    return cborCodec.decode(data);
  }

  public getBytes(): Uint8Array {
    return new Uint8Array(this.data);
  }
}
