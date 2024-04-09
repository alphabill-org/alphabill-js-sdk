import dedent from 'dedent';
import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { CloseFeeCreditAttributes } from './CloseFeeCreditAttributes.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';
import { TransactionPayload } from './TransactionPayload.js';

/**
 * Reclaim fee credit attributes array.
 */
export type ReclaimFeeCreditAttributesArray = [TransactionRecordArray, TransactionProofArray, Uint8Array];

/**
 * Reclaim fee credit payload attributes.
 */
export class ReclaimFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Reclaim fee credit attributes constructor.
   * @param {TransactionRecordWithProof<TransactionPayload<CloseFeeCreditAttributes>>} proof - Transaction record with proof.
   * @param {Uint8Array} _backlink - Backlink.
   */
  public constructor(
    public readonly proof: TransactionRecordWithProof<TransactionPayload<CloseFeeCreditAttributes>>,
    private readonly _backlink: Uint8Array,
  ) {
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.ReclaimFeeCreditAttributes;
  }

  /**
   * Get backlink.
   * @returns {Uint8Array} Backlink.
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
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
    return [this.proof.transactionRecord.toArray(), this.proof.transactionProof.toArray(), this.backlink];
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
        Backlink: ${Base16Converter.encode(this._backlink)}
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
