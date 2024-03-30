import { IUnitId } from '../IUnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type TransferBillToDustCollectorAttributesArray = readonly [bigint, Uint8Array, Uint8Array, Uint8Array];

export class TransferBillToDustCollectorAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly value: bigint,
    public readonly targetUnitId: IUnitId,
    public readonly targetUnitBacklink: Uint8Array,
    public readonly backlink: Uint8Array,
  ) {}

  public toOwnerProofData(): TransferBillToDustCollectorAttributesArray {
    return this.toArray();
  }

  public toArray(): TransferBillToDustCollectorAttributesArray {
    return [this.value, this.targetUnitId.getBytes(), this.targetUnitBacklink, this.backlink];
  }

  public toString(): string {
    return dedent`
      TransferBillToDustCollectorAttributes
        Value: ${this.value}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Backlink: ${Base16Converter.encode(this.targetUnitBacklink)}
        Backlink: ${Base16Converter.encode(this.backlink)}`;
  }
}
