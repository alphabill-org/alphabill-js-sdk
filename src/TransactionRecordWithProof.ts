import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
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
export class TransactionRecordWithProof<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  /**
   * Transaction record with proof constructor.
   * @param {TransactionRecord<T>} transactionRecord - transaction record.
   * @param {TransactionProof} transactionProof - transaction proof.
   */
  public constructor(
    public readonly transactionRecord: TransactionRecord<T>,
    public readonly transactionProof: TransactionProof,
  ) {}

  /**
   * Convert to array.
   * @returns {TransactionRecordWithProofArray} Transaction record with proof array.
   */
  public toArray(): TransactionRecordWithProofArray {
    return [this.transactionRecord.toArray(), this.transactionProof.toArray()];
  }

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

  /**
   * Create transaction record with proof from array.
   * @param {TransactionRecordWithProofArray} data - Transaction record with proof array.
   * @returns {TransactionRecordWithProof} Transaction record with proof.
   */
  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionRecordWithProofArray,
  ): TransactionRecordWithProof<TransactionPayload<T>> {
    return new TransactionRecordWithProof(TransactionRecord.fromArray(data[0]), TransactionProof.fromArray(data[1]));
  }
}
