import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { TransactionRecordWithProofArray } from '../../transaction/record/TransactionRecordWithProof.js';
import { dedent } from '../../util/StringUtils.js';
import { TransferFeeCreditTransactionRecordWithProof } from '../transactions/records/TransferFeeCreditTransactionRecordWithProof.js';

/**
 * Add fee credit attributes array.
 */
export type AddFeeCreditAttributesArray = [
  Uint8Array, // Owner predicate
  TransactionRecordWithProofArray, // Transfer fee credit transaction record with proof
];

/**
 * Add fee credit payload attributes.
 */
export class AddFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Add fee credit payload attributes constructor.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {TransferFeeCreditTransactionRecordWithProof} transactionRecordWithProof Transaction proof.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly transactionRecordWithProof: TransferFeeCreditTransactionRecordWithProof,
  ) {}

  /**
   * Create AddFeeCreditAttributes from raw CBOR.
   * @param {Uint8Array} rawData Add fee credit attributes as raw CBOR.
   * @returns {Promise<AddFeeCreditAttributes>} Add fee credit attributes.
   */
  public static async fromCbor(rawData: Uint8Array): Promise<AddFeeCreditAttributes> {
    const data = CborDecoder.readArray(rawData);
    return new AddFeeCreditAttributes(
      new PredicateBytes(CborDecoder.readByteString(data[0])),
      await TransferFeeCreditTransactionRecordWithProof.fromCbor(data[1]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      AddFeeCreditAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Transaction Record with Proof: 
          ${this.transactionRecordWithProof.toString()}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public async encode(cborCodec: ICborCodec): Promise<AddFeeCreditAttributesArray> {
    return [this.ownerPredicate.bytes, await this.transactionRecordWithProof.encode(cborCodec)];
  }
}
