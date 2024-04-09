import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';
import { SplitBillUnit, SplitBillUnitArray } from './SplitBillUnit.js';

/**
 * Split bill attributes array.
 */
export type SplitBillAttributesArray = [SplitBillUnitArray[], bigint, Uint8Array];

/**
 * Split bill attributes.
 */
export class SplitBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Split bill attributes constructor.
   * @param {readonly SplitBillUnit[]} _targetUnits - Target units.
   * @param {bigint} remainingBillValue - Remaining bill value.
   * @param {Uint8Array} _backlink - Backlink.
   */
  public constructor(
    private readonly _targetUnits: readonly SplitBillUnit[],
    public readonly remainingBillValue: bigint,
    private readonly _backlink: Uint8Array,
  ) {
    this._targetUnits = Array.from(this._targetUnits);
    this.remainingBillValue = BigInt(this.remainingBillValue);
    this._backlink = new Uint8Array(this._backlink);
  }

  /**
   * @see {ITransactionPayloadAttributes.payloadType}
   */
  public get payloadType(): PayloadType {
    return PayloadType.SplitBillAttributes;
  }

  /**
   * Get target units.
   * @returns {readonly SplitBillUnit[]} Target units.
   */
  public get targetUnits(): readonly SplitBillUnit[] {
    return Array.from(this._targetUnits);
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
  public toOwnerProofData(): SplitBillAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): SplitBillAttributesArray {
    return [this.targetUnits.map((unit) => unit.toArray()), this.remainingBillValue, this.backlink];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      SplitBillAttributes
        Target Units: [
          ${this._targetUnits.map((unit) => unit.toString()).join('\n')}
        ]
        Remaining Bill Value: ${this.remainingBillValue}
        Backlink: ${Base16Converter.encode(this._backlink)}`;
  }

  /**
   * Create a SplitBillAttributes from an array.
   * @param {SplitBillAttributesArray} data - Split bill attributes array.
   * @returns {SplitBillAttributes} Split bill attributes instance.
   */
  public static fromArray(data: SplitBillAttributesArray): SplitBillAttributes {
    const targetUnits: SplitBillUnit[] = [];

    for (let i = 0; i < data[0].length; i++) {
      targetUnits.push(SplitBillUnit.fromArray(data[0][i]));
    }

    return new SplitBillAttributes(targetUnits, data[1], data[2]);
  }
}
