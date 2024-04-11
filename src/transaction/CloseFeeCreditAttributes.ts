import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Close fee credit attributes array.
 */
export type CloseFeeCreditAttributesArray = readonly [bigint, Uint8Array, Uint8Array];

/**
 * Close fee credit payload attributes.
 */
export class CloseFeeCreditAttributes implements ITransactionPayloadAttributes {
  /**
   * Close fee credit payload attributes constructor.
   * @param {bigint} amount Amount.
   * @param {IUnitId} targetUnitId Target unit ID.
   * @param {Uint8Array} _targetUnitBacklink Target unit backlink.
   */
  public constructor(
    public readonly amount: bigint,
    public readonly targetUnitId: IUnitId,
    private readonly _targetUnitBacklink: Uint8Array,
  ) {
    this.amount = BigInt(this.amount);
    this._targetUnitBacklink = new Uint8Array(this._targetUnitBacklink);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.CloseFeeCreditAttributes;
  }

  /**
   * Get target unit backlink.
   * @returns {Uint8Array}
   */
  public get targetUnitBacklink(): Uint8Array {
    return new Uint8Array(this._targetUnitBacklink);
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
    return [this.amount, this.targetUnitId.bytes, this.targetUnitBacklink];
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
        Target Unit Backlink: ${Base16Converter.encode(this._targetUnitBacklink)}`;
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
