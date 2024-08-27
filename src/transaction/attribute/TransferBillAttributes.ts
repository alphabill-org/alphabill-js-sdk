import { PredicateBytes } from '../../PredicateBytes.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { PayloadType } from '../PayloadAttributeFactory.js';

/**
 * Transfer bill attributes array.
 */
export type TransferBillAttributesArray = [Uint8Array, bigint, bigint];

/**
 * Transfer bill payload attributes.
 */
export class TransferBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer bill attributes constructor.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} targetValue - Target value.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly targetValue: bigint,
    public readonly counter: bigint,
  ) {
    this.targetValue = BigInt(this.targetValue);
    this.counter = BigInt(this.counter);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.TransferBillAttributes;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): TransferBillAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): TransferBillAttributesArray {
    return [this.ownerPredicate.bytes, this.targetValue, this.counter];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferBillAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Target Value: ${this.targetValue}
        Counter: ${this.counter}`;
  }

  /**
   * Create TransferBillAttributes from array.
   * @param {TransferBillAttributesArray} data - Transfer bill attributes array.
   * @returns {TransferBillAttributes} Transfer bill attributes instance.
   */
  public static fromArray(data: TransferBillAttributesArray): TransferBillAttributes {
    return new TransferBillAttributes(new PredicateBytes(data[0]), data[1], data[2]);
  }
}
