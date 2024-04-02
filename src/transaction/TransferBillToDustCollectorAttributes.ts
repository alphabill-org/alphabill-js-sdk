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
        Target Unit Backlink: ${Base16Converter.Encode(this.targetUnitBacklink)}
        Backlink: ${Base16Converter.Encode(this.backlink)}`;
  }

  public static FromArray(data: TransferBillToDustCollectorAttributesArray): TransferBillToDustCollectorAttributes {
    return new TransferBillToDustCollectorAttributes(
      BigInt(data[0]),
      UnitId.FromBytes(new Uint8Array(data[1])),
      new Uint8Array(data[2]),
      new Uint8Array(data[3]),
    );
  }
}
