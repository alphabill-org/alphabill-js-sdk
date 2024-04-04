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
    private readonly value: bigint,
    private readonly targetUnitId: IUnitId,
    private readonly targetUnitBacklink: Uint8Array,
    private readonly backlink: Uint8Array,
  ) {
    this.value = BigInt(this.value);
    this.targetUnitBacklink = new Uint8Array(this.targetUnitBacklink);
    this.backlink = new Uint8Array(this.backlink);
  }

  public getValue(): bigint {
    return this.value;
  }

  public getTargetUnitId(): IUnitId {
    return this.targetUnitId;
  }

  public getTargetUnitBacklink(): Uint8Array {
    return new Uint8Array(this.targetUnitBacklink);
  }

  public getBacklink(): Uint8Array {
    return new Uint8Array(this.backlink);
  }

  public toOwnerProofData(): TransferBillToDustCollectorAttributesArray {
    return this.toArray();
  }

  public toArray(): TransferBillToDustCollectorAttributesArray {
    return [this.getValue(), this.getTargetUnitId().getBytes(), this.getTargetUnitBacklink(), this.getBacklink()];
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
