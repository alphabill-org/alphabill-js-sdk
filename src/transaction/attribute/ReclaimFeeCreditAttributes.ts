import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { CloseFeeCreditTransactionRecordWithProof } from '../record/CloseFeeCreditTransactionRecordWithProof.js';
import { TransactionRecordWithProofArray } from '../record/TransactionRecordWithProof.js';

/**
 * Reclaim fee credit attributes array.
 */
export type ReclaimFeeCreditAttributesArray = [
  TransactionRecordWithProofArray, // Close Fee Credit Transaction Record With Proof
];

/**
 * Reclaim fee credit payload attributes.
 */
export class ReclaimFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Reclaim fee credit attributes constructor.
   * @param {TransactionRecordWithProof<CloseFeeCreditAttributes>} proof - Transaction record with proof.
   */
  public constructor(public readonly proof: CloseFeeCreditTransactionRecordWithProof) {}

  /**
   * Create ReclaimFeeCreditAttributes from array.
   * @param {ReclaimFeeCreditAttributesArray} data - Reclaim fee credit attributes data array.
   * @param {ICborCodec} cborCodec Cbor codec.
   * @returns {ReclaimFeeCreditAttributes} Reclaim fee credit attributes instance.
   */
  public static async fromArray(
    [transactionRecordWithProof]: ReclaimFeeCreditAttributesArray,
    cborCodec: ICborCodec,
  ): Promise<ReclaimFeeCreditAttributes> {
    return new ReclaimFeeCreditAttributes(
      await CloseFeeCreditTransactionRecordWithProof.fromArray(transactionRecordWithProof, cborCodec),
    );
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public async encode(cborCodec: ICborCodec): Promise<ReclaimFeeCreditAttributesArray> {
    return [await this.proof.encode(cborCodec)];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      ReclaimFeeCreditAttributes
        Transaction Record With Proof: 
          ${this.proof.toString()}
      `;
  }
}
