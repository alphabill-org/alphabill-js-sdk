import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Transfer bill to dust collector attributes array.
 */
export type TransferBillToDustCollectorAttributesArray = readonly [
  bigint, // Value
  Uint8Array, // Target Unit ID
  bigint, // Target Unit Counter
  bigint, // Counter
];

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
   * Create TransferBillToDustCollectorAttributes from array.
   * @param {TransferBillToDustCollectorAttributesArray} data - Transfer bill to dust collector attributes data array.
   * @returns {TransferBillToDustCollectorAttributes} Transfer bill to dust collector attributes instance.
   */
  public static fromArray([
    value,
    targetUnitId,
    targetUnitCounter,
    counter,
  ]: TransferBillToDustCollectorAttributesArray): TransferBillToDustCollectorAttributes {
    return new TransferBillToDustCollectorAttributes(value, UnitId.fromBytes(targetUnitId), targetUnitCounter, counter);
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<TransferBillToDustCollectorAttributesArray> {
    return Promise.resolve([this.value, this.targetUnitId.bytes, this.targetUnitCounter, this.counter]);
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
}
