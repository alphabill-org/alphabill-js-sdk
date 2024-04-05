import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { ISigningService } from './ISigningService.js';

/**
 * Default signing service.
 * @implements {ISigningService}
 */
export class DefaultSigningService implements ISigningService {
  private readonly privateKey: Uint8Array;
  private readonly publicKey: Uint8Array;

  /**
   * Signing service constructor.
   * @param {Uint8Array} key private key bytes.
   */
  public constructor(key: Uint8Array) {
    this.privateKey = new Uint8Array(key);
    this.publicKey = secp256k1.getPublicKey(this.privateKey, true);
  }

  /**
   * Get public key bytes.
   * @returns {Uint8Array} public key bytes.
   */
  public getPublicKey(): Uint8Array {
    return new Uint8Array(this.publicKey);
  }

  /**
   * Sign given bytes.
   * @param {Uint8Array} bytes bytes to sign.
   * @returns {Promise<Uint8Array>} signature bytes.
   */
  // eslint-disable-next-line require-await
  public async sign(bytes: Uint8Array): Promise<Uint8Array> {
    const hash: Uint8Array = sha256(bytes);

    const signature = secp256k1.sign(hash, this.privateKey);
    return new Uint8Array([...signature.toCompactRawBytes(), signature.recovery]);
  }

  // eslint-disable-next-line require-await
  public async verify(bytes: Uint8Array, signature: Uint8Array): Promise<boolean> {
    const hash: Uint8Array = sha256(bytes);
    return secp256k1.verify(signature, hash, this.publicKey);
  }
}
