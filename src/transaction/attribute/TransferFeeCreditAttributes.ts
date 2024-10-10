import { IUnitId } from '../../IUnitId.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';

/**
 * Transfer fee credit attributes array.
 */
export type TransferFeeCreditAttributesArray = readonly [
  bigint, // Amount
  SystemIdentifier, // Target system identifier
  Uint8Array, // Target Unit ID
  bigint, // Latest addition time
  bigint | null, // Target unit counter
  bigint, // Counter
];

/**
 * Transfer fee credit payload attributes.
 */
export class TransferFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer fee credit attributes constructor.
   * @param {bigint} amount - Amount.
   * @param {SystemIdentifier} targetSystemIdentifier - Target system identifier.
   * @param {IUnitId} targetUnitId - Target unit ID.
   * @param {bigint} latestAdditionTime - Latest addition time.
   * @param {bigint | null} targetUnitCounter - Target unit counter.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    public readonly amount: bigint,
    public readonly targetSystemIdentifier: SystemIdentifier,
    public readonly targetUnitId: IUnitId,
    public readonly latestAdditionTime: bigint,
    public readonly targetUnitCounter: bigint | null,
    public readonly counter: bigint,
  ) {
    this.amount = BigInt(this.amount);
    this.latestAdditionTime = BigInt(this.latestAdditionTime);
    this.targetUnitCounter = this.targetUnitCounter ? BigInt(this.targetUnitCounter) : null;
    this.counter = BigInt(this.counter);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransferFeeCreditAttributes
        Amount: ${this.amount}
        Target System Identifier: ${this.targetSystemIdentifier.toString()}
        Target Unit ID: ${this.targetUnitId.toString()}
        Latest Addition Time: ${this.latestAdditionTime}
        Target Unit Counter: ${this.targetUnitCounter === null ? 'null' : this.targetUnitCounter}
        Counter: ${this.counter}`;
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public encode(): Promise<TransferFeeCreditAttributesArray> {
    return Promise.resolve([
      this.amount,
      this.targetSystemIdentifier,
      this.targetUnitId.bytes,
      this.latestAdditionTime,
      this.targetUnitCounter,
      this.counter,
    ]);
  }

  /**
   * Create TransferFeeCreditAttributes from array.
   * @param {TransferFeeCreditAttributesArray} data - Transfer fee credit attributes array.
   * @returns {TransferFeeCreditAttributes} Transfer fee credit attributes instance.
   */
  public static fromArray([
    amount,
    targetSystemIdentifier,
    targetUnitId,
    latestAdditionTime,
    targetUnitCounter,
    counter,
  ]: TransferFeeCreditAttributesArray): TransferFeeCreditAttributes {
    return new TransferFeeCreditAttributes(
      amount,
      targetSystemIdentifier,
      UnitId.fromBytes(targetUnitId),
      latestAdditionTime,
      targetUnitCounter,
      counter,
    );
  }
}
