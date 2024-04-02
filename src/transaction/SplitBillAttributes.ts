import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';
import { SplitBillUnit, SplitBillUnitArray } from './SplitBillUnit.js';

export type SplitBillAttributesArray = [SplitBillUnitArray[], bigint, Uint8Array];

@PayloadAttribute
export class SplitBillAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'split';
  }

  public constructor(
    public readonly targetUnits: ReadonlyArray<SplitBillUnit>,
    public readonly remainingBillValue: bigint,
    public readonly backlink: Uint8Array,
  ) {}

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
            ${this.targetUnits.map((unit) => unit.toString()).join('\n')}
          ]
          Remaining Bill Value: ${this.remainingBillValue}
          Backlink: ${Base16Converter.Encode(this.backlink)}`;
  }

  public static FromArray(data: SplitBillAttributesArray): SplitBillAttributes {
    const targetUnits = Array<SplitBillUnit>();

    for (let i = 0; i < data[0].length; i++) {
      targetUnits.push(SplitBillUnit.FromArray(data[0][i]));
    }

    return new SplitBillAttributes(targetUnits, BigInt(data[1]), new Uint8Array(data[2]));
  }
}
