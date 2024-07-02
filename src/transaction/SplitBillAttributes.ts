import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';
import { SplitBillUnit, SplitBillUnitArray } from './SplitBillUnit.js';

/**
 * Split bill attributes array.
 */
export type SplitBillAttributesArray = [SplitBillUnitArray[], bigint, bigint];

/**
 * Split bill attributes.
 */
export class SplitBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Split bill attributes constructor.
   * @param {readonly SplitBillUnit[]} _targetUnits - Target units.
   * @param {bigint} remainingBillValue - Remaining bill value.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    private readonly _targetUnits: readonly SplitBillUnit[],
    public readonly remainingBillValue: bigint,
    public readonly counter: bigint,
  ) {
    this._targetUnits = Array.from(this._targetUnits);
    this.remainingBillValue = BigInt(this.remainingBillValue);
    this.counter = BigInt(this.counter);
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
   * @see {ITransactionPayloadAttributes.toOwnerProofData}
   */
  public toOwnerProofData(): SplitBillAttributesArray {
    return this.toArray();
  }

  /**
   * @see {ITransactionPayloadAttributes.toArray}
   */
  public toArray(): SplitBillAttributesArray {
    return [this.targetUnits.map((unit) => unit.toArray()), this.remainingBillValue, this.counter];
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
        Counter: ${this.counter}`;
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
