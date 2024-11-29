import { sha256 } from '@noble/hashes/sha256';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { IPredicate } from './IPredicate.js';

/**
 * Pay to public key hash predicate.
 */
export class PayToPublicKeyHashPredicate implements IPredicate {
  private static readonly P2pkh256ID = 0x02;

  private constructor(private readonly _bytes: Uint8Array) {
    this._bytes = new Uint8Array(this._bytes);
  }

  /**
   * Get bytes.
   * @returns {Uint8Array} Bytes.
   */
  public get bytes(): Uint8Array {
    return new Uint8Array(this._bytes);
  }

  /**
   * Create pay to public key hash predicate.
   * @param {Uint8Array} publicKey - Public key.
   * @returns {PayToPublicKeyHashPredicate} Pay to public key hash predicate.
   */
  public static create(publicKey: Uint8Array): PayToPublicKeyHashPredicate {
    return new PayToPublicKeyHashPredicate(
      CborEncoder.encodeArray([
        new Uint8Array(0x00),
        new Uint8Array(PayToPublicKeyHashPredicate.P2pkh256ID),
        sha256(publicKey),
      ]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return `PayToPublicKeyHashPredicate[${Base16Converter.encode(this._bytes)}]`;
  }
}
