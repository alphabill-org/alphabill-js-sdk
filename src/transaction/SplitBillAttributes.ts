import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';
import { SplitBillUnit, SplitBillUnitArray } from './SplitBillUnit.js';

export type SplitBillAttributesArray = [SplitBillUnitArray[], bigint, Uint8Array];

const PAYLOAD_TYPE = 'split';

@PayloadAttribute(PAYLOAD_TYPE)
export class SplitBillAttributes implements ITransactionPayloadAttributes {
  public constructor(
    private readonly _targetUnits: readonly SplitBillUnit[],
    public readonly remainingBillValue: bigint,
    private readonly _backlink: Uint8Array,
  ) {
    this._targetUnits = Array.from(this._targetUnits);
    this.remainingBillValue = BigInt(this.remainingBillValue);
    this._backlink = new Uint8Array(this._backlink);
  }

  public get payloadType(): string {
    return PAYLOAD_TYPE;
  }

  public get targetUnits(): readonly SplitBillUnit[] {
    return Array.from(this._targetUnits);
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public toOwnerProofData(): SplitBillAttributesArray {
    return this.toArray();
  }

  public toArray(): SplitBillAttributesArray {
    return [this.targetUnits.map((unit) => unit.toArray()), this.remainingBillValue, this.backlink];
  }

  public toString(): string {
    return dedent`
      SplitBillAttributes
        Target Units: [
          ${this._targetUnits.map((unit) => unit.toString()).join('\n')}
        ]
        Remaining Bill Value: ${this.remainingBillValue}
        Backlink: ${Base16Converter.encode(this._backlink)}`;
  }

  public static fromArray(data: SplitBillAttributesArray): SplitBillAttributes {
    const targetUnits: SplitBillUnit[] = [];

    for (let i = 0; i < data[0].length; i++) {
      targetUnits.push(SplitBillUnit.fromArray(data[0][i]));
    }

    return new SplitBillAttributes(targetUnits, data[1], data[2]);
  }
}
