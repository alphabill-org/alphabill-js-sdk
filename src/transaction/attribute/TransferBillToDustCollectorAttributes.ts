import { IUnitId } from '../../IUnitId.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { PayloadType } from '../PayloadAttributeFactory.js';

/**
 * Transfer bill to dust collector attributes array.
 */
export type TransferBillToDustCollectorAttributesArray = readonly [bigint, Uint8Array, bigint, bigint];

/**
 * Transfer bill to dust collector payload attributes.
 */
export class TransferBillToDustCollectorAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer bill to dust collector attributes constructor.
   * @param {bigint} value - Value.
   * @param {IUnitId} targetUnitId - Target unit ID.
   * @param {bigint} targetUnitCounter - Target unit counter.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly value: bigint,
    public readonly targetUnitId: IUnitId,
    public readonly targetUnitCounter: bigint,
    public readonly counter: bigint,
  ) {
    this.value = BigInt(this.value);
    this.targetUnitCounter = BigInt(this.targetUnitCounter);
    this.counter = BigInt(this.counter);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.TransferBillToDustCollectorAttributes;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): TransferBillToDustCollectorAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): TransferBillToDustCollectorAttributesArray {
    return [this.value, this.targetUnitId.bytes, this.targetUnitCounter, this.counter];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferBillToDustCollectorAttributes
        Value: ${this.value}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Counter: ${this.targetUnitCounter}
        Counter: ${this.counter}`;
  }

  /**
   * Create TransferBillToDustCollectorAttributes from array.
   * @param {TransferBillToDustCollectorAttributesArray} data - Transfer bill to dust collector attributes data array.
   * @returns {TransferBillToDustCollectorAttributes} Transfer bill to dust collector attributes instance.
   */
  public static fromArray(data: TransferBillToDustCollectorAttributesArray): TransferBillToDustCollectorAttributes {
    return new TransferBillToDustCollectorAttributes(data[0], UnitId.fromBytes(data[1]), data[2], data[3]);
  }
}
