import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

/**
 * Transfer bill to dust collector attributes array.
 */
export type TransferBillToDustCollectorAttributesArray = readonly [bigint, Uint8Array, Uint8Array, Uint8Array];

/**
 * Transfer bill to dust collector payload attributes.
 */
export class TransferBillToDustCollectorAttributes implements ITransactionPayloadAttributes {
  /**
   * Transfer bill to dust collector attributes constructor.
   * @param {bigint} value - Value.
   * @param {IUnitId} targetUnitId - Target unit ID.
   * @param {Uint8Array} _targetUnitBacklink - Target unit backlink.
   * @param {Uint8Array} _backlink - Backlink.
   */
  public constructor(
    public readonly value: bigint,
    public readonly targetUnitId: IUnitId,
    private readonly _targetUnitBacklink: Uint8Array,
    private readonly _backlink: Uint8Array,
  ) {
    this.value = BigInt(this.value);
    this._targetUnitBacklink = new Uint8Array(this._targetUnitBacklink);
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.TransferBillToDustCollectorAttributes;
  }

  /**
   * Get target unit backlink.
   * @returns {Uint8Array} Target unit backlink.
   */
  public get targetUnitBacklink(): Uint8Array {
    return new Uint8Array(this._targetUnitBacklink);
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
  public toOwnerProofData(): TransferBillToDustCollectorAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): TransferBillToDustCollectorAttributesArray {
    return [this.value, this.targetUnitId.bytes, this.targetUnitBacklink, this.backlink];
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
        Target Unit Backlink: ${Base16Converter.encode(this._targetUnitBacklink)}
        Backlink: ${Base16Converter.encode(this._backlink)}`;
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
