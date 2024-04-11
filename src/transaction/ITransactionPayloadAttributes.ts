import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Transaction payload attributes interface.
 * @interface ITransactionPayloadAttributes
 */
export interface ITransactionPayloadAttributes {
  /**
   * Payload type string.
   * @returns {PayloadType} Payload type.
   */
  get payloadType(): PayloadType;
  /**
   * Convert to owner proof data array.
   * @returns {readonly unknown[]} Owner proof data array.
   */
  toOwnerProofData(): readonly unknown[];
  /**
   * Convert to array.
   * @returns {readonly unknown[]} Array of payload attributes.
   */
  toArray(): readonly unknown[];
}
