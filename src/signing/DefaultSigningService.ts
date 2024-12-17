import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { ISigningService } from './ISigningService.js';

/**
 * Default signing service.
 * @implements {ISigningService}
 */
export class DefaultSigningService implements ISigningService {
  private readonly privateKey: Uint8Array;
  private readonly _publicKey: Uint8Array;

  /**
   * Signing service constructor.
   * @param {Uint8Array} key private key bytes.
   */
  public constructor(key: Uint8Array) {
    this.privateKey = new Uint8Array(key);
    this._publicKey = secp256k1.getPublicKey(this.privateKey, true);
  }

  /**
   * @see {ISigningService.publicKey}
   */
  public get publicKey(): Uint8Array {
    return new Uint8Array(this._publicKey);
  }

  /**
   * Verify secp256k1 signature hash.
   * @param hash Hash.
   * @param signature Signature.
   * @param publicKey Public key.
   */
  public static verify(hash: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean {
    return secp256k1.verify(signature, hash, publicKey, { format: 'compact' });
  }

  /**
   * @see {ISigningService.sign}
   */
  public sign(bytes: Uint8Array): Promise<Uint8Array> {
    const hash: Uint8Array = sha256(bytes);
    const signature = secp256k1.sign(hash, this.privateKey);
    return Promise.resolve(new Uint8Array([...signature.toCompactRawBytes(), signature.recovery]));
  }
}
