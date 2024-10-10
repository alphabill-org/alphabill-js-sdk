import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { PredicateBytes } from '../../PredicateBytes.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../order/TransactionOrder.js';
import { OwnerProofAuthProof } from '../proof/OwnerProofAuthProof';
import { TransferFeeCreditTransactionRecordWithProof } from '../record/TransferFeeCreditTransactionRecordWithProof.js';
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
   * @param {TransactionRecordWithProof<TransferFeeCreditAttributes>} transactionRecordWithProof Transaction proof.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly transactionRecordWithProof: TransactionRecordWithProof<
      TransactionOrder<TransferFeeCreditAttributes, OwnerProofAuthProof, OwnerProofAuthProof>
    >,
  ) {}

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
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public async encode(cborCodec: ICborCodec): Promise<AddFeeCreditAttributesArray> {
    const proof = await this.transactionRecordWithProof.encode(cborCodec);
    return [this.ownerPredicate.bytes, ...proof];
  }

  /**
   * Create AddFeeCreditAttributes from array.
   * @param {AddFeeCreditAttributesArray} data Add fee credit attributes array.
   * @param {ICborCodec} cborCodec
   * @returns {Promise<AddFeeCreditAttributes>} Add fee credit attributes.
   */
  public static async fromArray(
    data: AddFeeCreditAttributesArray,
    cborCodec: ICborCodec,
  ): Promise<AddFeeCreditAttributes> {
    return new AddFeeCreditAttributes(
      new PredicateBytes(data[0]),
      await TransferFeeCreditTransactionRecordWithProof.fromArray([data[1], data[2]], cborCodec),
    );
  }
}
