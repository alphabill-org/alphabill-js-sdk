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
    private readonly targetUnits: readonly SplitBillUnit[],
    private readonly remainingBillValue: bigint,
    private readonly backlink: Uint8Array,
  ) {
    this.remainingBillValue = BigInt(this.remainingBillValue);
    this.backlink = new Uint8Array(this.backlink);
  }

  public getTargetUnits(): readonly SplitBillUnit[] {
    return Array.from(this.targetUnits);
  }

  public getRemainingBillValue(): bigint {
    return this.remainingBillValue;
  }

  public getBacklink(): Uint8Array {
    return new Uint8Array(this.backlink);
  }

  public toOwnerProofData(): SplitBillAttributesArray {
    return this.toArray();
  }

  public toArray(): SplitBillAttributesArray {
    return [this.getTargetUnits().map((unit) => unit.toArray()), this.getRemainingBillValue(), this.getBacklink()];
  }

  public toString(): string {
    return dedent`
      SplitBillAttributes
        Target Units: [
          ${this.targetUnits.map((unit) => unit.toString()).join('\n')}
        ]
        Remaining Bill Value: ${this.remainingBillValue}
        Backlink: ${Base16Converter.encode(this.backlink)}`;
  }

  public static fromArray(data: SplitBillAttributesArray): SplitBillAttributes {
    const targetUnits: SplitBillUnit[] = [];

    for (let i = 0; i < data[0].length; i++) {
      targetUnits.push(SplitBillUnit.fromArray(data[0][i]));
    }

    return new SplitBillAttributes(targetUnits, data[1], data[2]);
  }
}
