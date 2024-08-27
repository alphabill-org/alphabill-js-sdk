import { PredicateBytes } from '../../PredicateBytes.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { PayloadType } from '../PayloadAttributeFactory.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { TransferFeeCreditAttributes } from './TransferFeeCreditAttributes.js';

/**
 * Add fee credit attributes array.
 */
export type AddFeeCreditAttributesArray = [Uint8Array, ...TransactionRecordWithProofArray];

/**
 * Add fee credit payload attributes.
 */
export class AddFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Add fee credit payload attributes constructor.
   * @param {IPredicate} ownerPredicate Owner predicate.
   * @param {TransactionRecordWithProof<TransactionPayload<TransferFeeCreditAttributes>>} transactionProof Transaction proof.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly transactionProof: TransactionRecordWithProof<TransactionPayload<TransferFeeCreditAttributes>>,
  ) {}

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.AddFeeCreditAttributes;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): AddFeeCreditAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): AddFeeCreditAttributesArray {
    const proof = this.transactionProof.toArray();
    return [this.ownerPredicate.bytes, ...proof];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      AddFeeCreditAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Transaction Proof: 
          ${this.transactionProof.toString()}`;
  }

  /**
   * Create AddFeeCreditAttributes from array.
   * @param {AddFeeCreditAttributesArray} data Add fee credit attributes array.
   * @returns {AddFeeCreditAttributes} Add fee credit attributes.
   */
  public static fromArray(data: AddFeeCreditAttributesArray): AddFeeCreditAttributes {
    return new AddFeeCreditAttributes(
      new PredicateBytes(data[0]),
      TransactionRecordWithProof.fromArray([data[1], data[2]]),
    );
  }
}
