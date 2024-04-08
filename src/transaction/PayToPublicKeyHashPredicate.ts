import { sha256 } from '@noble/hashes/sha256';
import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { IPredicate } from './IPredicate.js';

export class PayToPublicKeyHashPredicate implements IPredicate {
  private static readonly P2pkh256ID = 0x02;

  private constructor(private readonly _bytes: Uint8Array) {
    this._bytes = new Uint8Array(this._bytes);
  }

  public get bytes(): Uint8Array {
    return new Uint8Array(this._bytes);
  }

  public static async create(cborCodec: ICborCodec, publicKey: Uint8Array): Promise<PayToPublicKeyHashPredicate> {
    return new PayToPublicKeyHashPredicate(
      await cborCodec.encode([0x00, new Uint8Array([PayToPublicKeyHashPredicate.P2pkh256ID]), sha256(publicKey)]),
    );
  }

  public toString(): string {
    return `PayToPublicKeyHashPredicate[${Base16Converter.encode(this._bytes)}]`;
  }
}
