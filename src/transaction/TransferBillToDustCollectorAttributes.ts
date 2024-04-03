import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type TransferBillToDustCollectorAttributesArray = readonly [bigint, Uint8Array, Uint8Array, Uint8Array];

@PayloadAttribute
export class TransferBillToDustCollectorAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'transDC';
  }

  public constructor(
    public readonly value: bigint,
    public readonly targetUnitId: IUnitId,
    public readonly targetUnitBacklink: Uint8Array,
    public readonly backlink: Uint8Array,
  ) {
    this.value = BigInt(this.value);
    this.targetUnitBacklink = new Uint8Array(this.targetUnitBacklink);
    this.backlink = new Uint8Array(this.backlink);
  }

  public toOwnerProofData(): TransferBillToDustCollectorAttributesArray {
    return this.toArray();
  }

  public toArray(): TransferBillToDustCollectorAttributesArray {
    return [
      this.value,
      this.targetUnitId.getBytes(),
      new Uint8Array(this.targetUnitBacklink),
      new Uint8Array(this.backlink),
    ];
  }

  public toString(): string {
    return dedent`
      TransferBillToDustCollectorAttributes
        Value: ${this.value}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Backlink: ${Base16Converter.encode(this.targetUnitBacklink)}
        Backlink: ${Base16Converter.encode(this.backlink)}`;
  }

  public static fromArray(data: TransferBillToDustCollectorAttributesArray): TransferBillToDustCollectorAttributes {
    return new TransferBillToDustCollectorAttributes(data[0], UnitId.fromBytes(data[1]), data[2], data[3]);
  }
}
