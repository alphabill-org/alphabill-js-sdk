import { PredicateBytes } from '../PredicateBytes.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../TransactionRecordWithProof.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';
import { TransactionPayload } from './TransactionPayload.js';
import { TransferFeeCreditAttributes } from './TransferFeeCreditAttributes.js';

export type AddFeeCreditAttributesArray = [Uint8Array, ...TransactionRecordWithProofArray];

const PAYLOAD_TYPE = 'addFC';

/**
 * Add fee credit payload attributes.
 */
@PayloadAttribute(PAYLOAD_TYPE)
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
  public get payloadType(): string {
    return PAYLOAD_TYPE;
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
   * Add fee credit attributes to string.
   * @returns {string} Add fee credit attributes to string.
   */
  public toString(): string {
    return dedent`
      AddFeeCreditAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Transaction Proof: 
          ${this.transactionProof.toString()}`;
  }

  /**
   * Create add fee credit attributes from array.
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
