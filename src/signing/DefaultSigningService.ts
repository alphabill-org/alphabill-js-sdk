import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { ISigningService } from './ISigningService.js';

export class DefaultSigningService implements ISigningService {
  private readonly privateKey: Uint8Array;
  public readonly publicKey: Uint8Array;

  public constructor(key: Uint8Array) {
    this.privateKey = key;
    this.publicKey = secp256k1.getPublicKey(this.privateKey, true);
  }

  public async sign(bytes: Uint8Array): Promise<Uint8Array> {
    const hash: Uint8Array = sha256(bytes);

    const signature = secp256k1.sign(hash, this.privateKey);
    return new Uint8Array([...signature.toCompactRawBytes(), signature.recovery]);
  }

  public async verify(bytes: Uint8Array, signature: Uint8Array): Promise<boolean> {
    const hash: Uint8Array = sha256(bytes);
    return secp256k1.verify(signature, hash, this.publicKey);
  }
}
