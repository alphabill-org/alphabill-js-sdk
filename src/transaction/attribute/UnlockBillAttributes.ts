import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

import { TransactionOrderType } from '../TransactionOrderType';

/**
 * Unlock bill attributes array.
 */
export type UnlockBillAttributesArray = readonly [bigint];

/**
 * Unlock bill payload attributes.
 */
export class UnlockBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Unlock bill attributes constructor.
   * @param {Uint8Array} counter - Counter.
   */
  public constructor(public readonly counter: bigint) {
    this.counter = BigInt(this.counter);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): TransactionOrderType {
    return TransactionOrderType.UnlockBill;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): UnlockBillAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): UnlockBillAttributesArray {
    return [this.counter];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      UnlockBillAttributes
        Counter: ${this.counter}`;
  }

  /**
   * Create UnlockBillAttributes from array.
   * @param {UnlockBillAttributesArray} data Unlock bill attributes array.
   * @returns {UnlockBillAttributes} Unlock bill attributes instance.
   */
  public static fromArray(data: UnlockBillAttributesArray): UnlockBillAttributes {
    return new UnlockBillAttributes(data[0]);
  }
}
