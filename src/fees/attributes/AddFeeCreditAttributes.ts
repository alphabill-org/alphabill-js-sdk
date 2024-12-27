import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { IPredicate } from '../../transaction/predicates/IPredicate.js';
import { PredicateBytes } from '../../transaction/predicates/PredicateBytes.js';
import { TransactionRecordWithProof } from '../../transaction/record/TransactionRecordWithProof.js';
import { dedent } from '../../util/StringUtils.js';
import { TransferFeeCredit, TransferFeeCreditTransactionOrder } from '../transactions/TransferFeeCredit.js';

/**
 * Add fee credit payload attributes.
 */
export class AddFeeCreditAttributes implements ITransactionPayloadAttributes {
  private readonly _brand: 'AddFeeCreditAttributes';

  /**
   * Add fee credit payload attributes constructor.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {TransactionRecordWithProof<TransferFeeCreditTransactionOrder>} transactionRecordWithProof Transaction proof.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly transactionRecordWithProof: TransactionRecordWithProof<TransferFeeCreditTransactionOrder>,
  ) {}

  /**
   * Create AddFeeCreditAttributes from raw CBOR.
   * @param {Uint8Array} rawData Add fee credit attributes as raw CBOR.
   * @returns {AddFeeCreditAttributes} Add fee credit attributes.
   */
  public static fromCbor(rawData: Uint8Array): AddFeeCreditAttributes {
    const data = CborDecoder.readArray(rawData);
    return new AddFeeCreditAttributes(
      new PredicateBytes(CborDecoder.readByteString(data[0])),
      TransferFeeCredit.createTransactionRecordWithProof(data[1]),
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
        ${this.transactionRecordWithProof.toString()}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([
      CborEncoder.encodeByteString(this.ownerPredicate.bytes),
      this.transactionRecordWithProof.encode(),
    ]);
  }
}
