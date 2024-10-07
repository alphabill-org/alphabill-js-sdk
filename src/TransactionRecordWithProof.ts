import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionOrder } from './transaction/order/TransactionOrder';
import { TransactionProof, TransactionProofArray } from './TransactionProof.js';
import { TransactionRecord, TransactionRecordArray } from './TransactionRecord.js';
import { dedent } from './util/StringUtils.js';

/**
 * Transaction record with proof array.
 */
export type TransactionRecordWithProofArray = readonly [TransactionRecordArray, TransactionProofArray];

/**
 * Transaction record with proof.
 * @template T - Transaction payload type.
 */
export class TransactionRecordWithProof<Attributes extends ITransactionPayloadAttributes, Proof> {
  /**
   * Transaction record with proof constructor.
   * @param {TransactionRecord<T>} transactionRecord - transaction record.
   * @param {TransactionProof} transactionProof - transaction proof.
   */
  public constructor(
    public readonly transactionRecord: TransactionRecord<Attributes, Proof>,
    public readonly transactionProof: TransactionProof,
  ) {}

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionRecordWithProof
        ${this.transactionRecord.toString()}
        ${this.transactionProof.toString()}`;
  }
}
