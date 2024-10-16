import { IUnitId } from '../../IUnitId.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';

/**
 * Close fee credit attributes array.
 */
export type CloseFeeCreditAttributesArray = readonly [
  bigint, // Amount
  Uint8Array, // Target unit ID
  bigint, // Target unit counter
  bigint, // Counter
];

/**
 * Close fee credit payload attributes.
 */
export class CloseFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Close fee credit payload attributes constructor.
   * @param {bigint} amount Amount is the current balance of the fee credit record.
   * @param {IUnitId} targetUnitId Target unit ID is the UnitID of the existing bill in the money partition that will receive the reclaimed fee credit amount.
   * @param {bigint} targetUnitCounter Target unit counter is the current counter value of the target bill where to reclaim fee credits in money partition.
   * @param {bigint} counter Counter is the transaction counter of this fee credit record.
   */
  public constructor(
    public readonly amount: bigint,
    public readonly targetUnitId: IUnitId,
    public readonly targetUnitCounter: bigint,
    public readonly counter: bigint,
  ) {
    this.amount = BigInt(this.amount);
    this.targetUnitCounter = BigInt(this.targetUnitCounter);
    this.counter = BigInt(this.counter);
  }

  /**
   * Create CloseFeeCreditAttributes from array.
   * @param {CloseFeeCreditAttributesArray} data Close fee credit attributes array.
   * @returns {CloseFeeCreditAttributes} Close fee credit attributes instance.
   */
  public static fromArray([
    amount,
    targetUnitId,
    targetUnitCounter,
    counter,
  ]: CloseFeeCreditAttributesArray): CloseFeeCreditAttributes {
    return new CloseFeeCreditAttributes(amount, UnitId.fromBytes(targetUnitId), targetUnitCounter, counter);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      CloseFeeCreditAttributes
        Amount: ${this.amount}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Counter: ${this.targetUnitCounter}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<CloseFeeCreditAttributesArray> {
    return Promise.resolve([this.amount, this.targetUnitId.bytes, this.targetUnitCounter, this.counter]);
  }
}
