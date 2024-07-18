import dedent from 'dedent';
import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { CloseFeeCreditAttributes } from './CloseFeeCreditAttributes.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';
import { TransactionPayload } from './TransactionPayload.js';

/**
 * Reclaim fee credit attributes array.
 */
export type ReclaimFeeCreditAttributesArray = [TransactionRecordArray, TransactionProofArray, bigint];

/**
 * Reclaim fee credit payload attributes.
 */
export class ReclaimFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Reclaim fee credit attributes constructor.
   * @param {TransactionRecordWithProof<TransactionPayload<CloseFeeCreditAttributes>>} proof - Transaction record with proof.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly proof: TransactionRecordWithProof<TransactionPayload<CloseFeeCreditAttributes>>,
    public readonly counter: bigint,
  ) {
    this.counter = BigInt(this.counter);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.ReclaimFeeCreditAttributes;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): ReclaimFeeCreditAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): ReclaimFeeCreditAttributesArray {
    return [this.proof.transactionRecord.toArray(), this.proof.transactionProof.toArray(), this.counter];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      ReclaimFeeCreditAttributes
        Transaction Proof: 
          ${this.proof.toString()}
        Counter: ${this.counter}
      `;
  }

  /**
   * Create ReclaimFeeCreditAttributes from array.
   * @param {ReclaimFeeCreditAttributesArray} data - Reclaim fee credit attributes data array.
   * @returns {ReclaimFeeCreditAttributes} Reclaim fee credit attributes instance.
   */
  public static fromArray(data: ReclaimFeeCreditAttributesArray): ReclaimFeeCreditAttributes {
    return new ReclaimFeeCreditAttributes(TransactionRecordWithProof.fromArray([data[0], data[1]]), data[2]);
  }
}
