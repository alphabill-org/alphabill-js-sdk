import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { dedent } from '../../util/StringUtils.js';
import { CloseFeeCredit, CloseFeeCreditTransactionOrder } from '../transactions/CloseFeeCredit.js';

/**
 * Reclaim fee credit payload attributes.
 */
export class ReclaimFeeCreditAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'ReclaimFeeCreditAttributes';

  /**
   * Reclaim fee credit attributes constructor.
   * @param {TransactionRecordWithProof<CloseFeeCreditAttributes>} proof - Transaction record with proof.
   */
  public constructor(public readonly proof: TransactionRecordWithProof<CloseFeeCreditTransactionOrder>) {}

  /**
   * Create ReclaimFeeCreditAttributes from raw CBOR.
   * @param {Uint8Array} rawData - Reclaim fee credit attributes data as raw CBOR.
   * @returns {ReclaimFeeCreditAttributes} Reclaim fee credit attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): ReclaimFeeCreditAttributes {
    const data = CborDecoder.readArray(rawData);
    return new ReclaimFeeCreditAttributes(CloseFeeCredit.createTransactionRecordWithProof(data[0]));
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
