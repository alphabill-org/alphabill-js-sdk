import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';
import { CloseFeeCreditTransactionRecordWithProof } from '../transactions/records/CloseFeeCreditTransactionRecordWithProof.js';

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
  public static fromCbor(rawData: Uint8Array): ReclaimFeeCreditAttributes {
    const data = CborDecoder.readArray(rawData);
    return new ReclaimFeeCreditAttributes(CloseFeeCreditTransactionRecordWithProof.fromCbor(data[0]));
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([this.proof.encode()]);
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
