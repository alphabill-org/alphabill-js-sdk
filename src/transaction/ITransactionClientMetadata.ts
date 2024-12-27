import { IUnitId } from '../IUnitId.js';

/**
 * Transaction client metadata.
 * @interface ITransactionClientMetadata
 */
export interface ITransactionClientMetadata {
  /**
   * Transaction timeout.
   * @type {bigint}
   */
  readonly timeout: bigint;
  /**
   * Maximum transaction fee.
   * @type {bigint}
   */
  readonly maxTransactionFee: bigint;
  /**
   * Fee credit record ID.
   * @type {IUnitId | null}
   */
  readonly feeCreditRecordId: IUnitId | null;
  /**
   * Reference number.
   * @type {Uint8Array}
   */
  readonly referenceNumber: Uint8Array | null;
}
