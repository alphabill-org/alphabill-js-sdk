import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { SplitBillUnit } from './SplitBillUnit.js';

export class SplitBillAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly targetUnits: ReadonlyArray<SplitBillUnit>,
    public readonly remainingBillValue: bigint,
    public readonly backlink: Uint8Array,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [this.targetUnits.map((unit) => unit.toArray()), this.remainingBillValue, this.backlink];
  }
}
