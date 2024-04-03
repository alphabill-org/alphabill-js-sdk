/**
 * Signing service
 */
export interface ISigningService {
  /**
   * Get user public key
   */
  getPublicKey(): Uint8Array;

  /**
   * Sign bytes with user private key
   * @param bytes data bytes to sign
   */
  sign(bytes: Uint8Array): Promise<Uint8Array>;
}
