import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type CloseFeeCreditAttributesArray = readonly [bigint, Uint8Array, Uint8Array];

const PAYLOAD_TYPE = 'closeFC';

/**
 * Close fee credit payload attributes.
 */
@PayloadAttribute(PAYLOAD_TYPE)
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
  public get payloadType(): string {
    return PAYLOAD_TYPE;
  }

  /**
   * Target unit backlink.
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
   * Close fee credit attributes to string.
   * @returns {string} Close fee credit attributes to string.
   */
  public toString(): string {
    return dedent`
      CloseFeeCreditAttributes
        Amount: ${this.amount}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Backlink: ${Base16Converter.encode(this._targetUnitBacklink)}`;
  }

  /**
   * Create close fee credit attributes from array.
   * @param {CloseFeeCreditAttributesArray} data Close fee credit attributes array.
   * @returns {CloseFeeCreditAttributes} Close fee credit attributes.
   */
  public static fromArray(data: CloseFeeCreditAttributesArray): CloseFeeCreditAttributes {
    return new CloseFeeCreditAttributes(data[0], UnitId.fromBytes(data[1]), data[2]);
  }
}
