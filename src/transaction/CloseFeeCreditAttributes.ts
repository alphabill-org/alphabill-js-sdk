import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Close fee credit attributes array.
 */
export type CloseFeeCreditAttributesArray = readonly [bigint, Uint8Array, bigint];

/**
 * Close fee credit payload attributes.
 */
export class CloseFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Close fee credit payload attributes constructor.
   * @param {bigint} amount Amount.
   * @param {IUnitId} targetUnitId Target unit ID.
   * @param {bigint} targetUnitCounter Target unit counter.
   */
  public constructor(
    public readonly amount: bigint,
    public readonly targetUnitId: IUnitId,
    public readonly targetUnitCounter: bigint,
  ) {
    this.amount = BigInt(this.amount);
    this.targetUnitCounter = BigInt(this.targetUnitCounter);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.CloseFeeCreditAttributes;
  }

  /**
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): CloseFeeCreditAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): CloseFeeCreditAttributesArray {
    return [this.amount, this.targetUnitId.bytes, this.targetUnitCounter];
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
        Target Unit Counter: ${this.targetUnitCounter}`;
  }

  /**
   * Create CloseFeeCreditAttributes from array.
   * @param {CloseFeeCreditAttributesArray} data Close fee credit attributes array.
   * @returns {CloseFeeCreditAttributes} Close fee credit attributes instance.
   */
  public static fromArray(data: CloseFeeCreditAttributesArray): CloseFeeCreditAttributes {
    return new CloseFeeCreditAttributes(data[0], UnitId.fromBytes(data[1]), data[2]);
  }
}
