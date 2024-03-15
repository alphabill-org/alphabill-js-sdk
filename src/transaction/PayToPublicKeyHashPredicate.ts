import { sha256 } from '@noble/hashes/sha256';
import { IPredicate } from './IPredicate.js';
import { ICborCodec } from '../codec/cbor/ICborCodec.js';


export class PayToPublicKeyHashPredicate implements IPredicate {
  private static readonly P2pkh256ID = 0x02;

  private constructor(private readonly bytes: Uint8Array) {}

  public getBytes(): Uint8Array {
    return new Uint8Array(this.bytes);
  }

  public static async Create(cborCodec: ICborCodec, publicKey: Uint8Array): Promise<PayToPublicKeyHashPredicate> {
    return new PayToPublicKeyHashPredicate(
      await cborCodec.encode([0x00, new Uint8Array([PayToPublicKeyHashPredicate.P2pkh256ID]), sha256(publicKey)]),
    );
  }
}
