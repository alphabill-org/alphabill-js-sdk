import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { TransactionRecordWithProofArray } from '../../transaction/record/TransactionRecordWithProof.js';
import { dedent } from '../../util/StringUtils.js';
import { CloseFeeCreditTransactionRecordWithProof } from '../transactions/records/CloseFeeCreditTransactionRecordWithProof.js';

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
   * Create ReclaimFeeCreditAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Reclaim fee credit attributes data as raw CBOR.
   * @returns {ReclaimFeeCreditAttributes} Reclaim fee credit attributes instance.
   */
  public static async fromCbor(rawData: Uint8Array): Promise<ReclaimFeeCreditAttributes> {
    const data = CborDecoder.readArray(rawData);
    return new ReclaimFeeCreditAttributes(await CloseFeeCreditTransactionRecordWithProof.fromCbor(data[0]));
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
