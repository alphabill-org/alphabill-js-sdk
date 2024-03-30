import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type CloseFeeCreditAttributesArray = readonly [bigint, Uint8Array, Uint8Array];

export class CloseFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly amount: bigint,
    public readonly targetUnitId: IUnitId,
    public readonly targetUnitBacklink: Uint8Array,
  ) {}

  public toOwnerProofData(): CloseFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): CloseFeeCreditAttributesArray {
    return [this.amount, this.targetUnitId.getBytes(), this.targetUnitBacklink];
  }

  public toString(): string {
    return dedent`
      CloseFeeCreditAttributes
        Amount: ${this.amount}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Backlink: ${Base16Converter.encode(this.targetUnitBacklink)}`;
  }
}
