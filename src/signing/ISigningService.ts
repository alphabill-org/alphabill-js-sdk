/**
 * Signing service interface.
 * @interface ISigningService
 */
export interface ISigningService {
  /**
   * Get user public key.
   * @returns {Uint8Array} public key bytes.
   */
  get publicKey(): Uint8Array;

  /**
   * Sign bytes with user private key.
   * @param {Uint8Array} bytes data bytes to sign.
   * @returns {Uint8Array} signature bytes.
   */
  sign(bytes: Uint8Array): Promise<Uint8Array>;
}
