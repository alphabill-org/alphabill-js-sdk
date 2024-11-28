import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { ITransactionPayloadAttributes } from '../../transaction/ITransactionPayloadAttributes.js';
import { dedent } from '../../util/StringUtils.js';
import { SplitBillUnit, SplitBillUnitArray } from '../SplitBillUnit.js';

/**
 * Split bill attributes array.
 */
export type SplitBillAttributesArray = [
  SplitBillUnitArray[], // Target Split Bill Units
  bigint, // Counter
];

/**
 * Split bill attributes.
 */
export class SplitBillAttributes implements ITransactionPayloadAttributes {
  /**
   * Split bill attributes constructor.
   * @param {readonly SplitBillUnit[]} _targetUnits - Target units.
   * @param {bigint} counter - Counter.
   */
  public constructor(
    private readonly _targetUnits: readonly SplitBillUnit[],
    public readonly counter: bigint,
  ) {
    this._targetUnits = Array.from(this._targetUnits);
    this.counter = BigInt(this.counter);
  }

  /**
   * Get target units.
   * @returns {readonly SplitBillUnit[]} Target units.
   */
  public get targetUnits(): readonly SplitBillUnit[] {
    return Array.from(this._targetUnits);
  }

  /**
   * Create a SplitBillAttributes from raw CBOR.
   * @param {SplitBillAttributesArray} rawData - Split bill attributes as raw CBOR.
   * @returns {SplitBillAttributes} Split bill attributes instance.
   */
  public static fromCbor(rawData: Uint8Array): SplitBillAttributes {
    const data = CborDecoder.readArray(rawData);
    return new SplitBillAttributes(
      CborDecoder.readArray(data[0]).map((unit: Uint8Array) => SplitBillUnit.fromCbor(unit)),
      CborDecoder.readUnsignedInteger(data[1]),
    );
  }

  /**
   * @see {ITransactionPayloadAttributes.encode}
   */
  public encode(): Promise<SplitBillAttributesArray> {
    return Promise.resolve([this.targetUnits.map((unit) => unit.encode()), this.counter]);
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      SplitBillAttributes
        Target Units: [${this._targetUnits.length ? `\n${this._targetUnits.map((unit) => unit.toString()).join('\n')}\n` : ''}]
        Counter: ${this.counter}`;
  }
}
