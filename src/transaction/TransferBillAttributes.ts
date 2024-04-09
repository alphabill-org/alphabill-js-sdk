import { PredicateBytes } from '../PredicateBytes.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Transfer bill attributes array.
 */
export type TransferBillAttributesArray = [Uint8Array, bigint, Uint8Array];

/**
 * Transfer bill payload attributes.
 */
export class TransferBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer bill attributes constructor.
   * @param {IPredicate} ownerPredicate - Owner predicate.
   * @param {bigint} targetValue - Target value.
   * @param {Uint8Array} _backlink - Backlink.
   */
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly targetValue: bigint,
    private readonly _backlink: Uint8Array,
  ) {
    this.targetValue = BigInt(this.targetValue);
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.TransferBillAttributes;
  }

  /**
   * Get backlink.
   * @returns {Uint8Array} Backlink.
   */
  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
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
    return [this.ownerPredicate.bytes, this.targetValue, this.backlink];
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
        Backlink: ${Base16Converter.encode(this._backlink)}`;
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
