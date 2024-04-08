/**
 * Signing service interface.
 */
export interface ISigningService {
  /**
   * Get user public key.
   */
  get publicKey(): Uint8Array;

  /**
   * Sign bytes with user private key.
   * @param {Uint8Array} bytes data bytes to sign.
   * @returns {Promise<Uint8Array>} signature bytes.
   */
  sign(bytes: Uint8Array): Promise<Uint8Array>;
}
