import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

export type TransferBillToDustCollectorAttributesArray = readonly [bigint, Uint8Array, Uint8Array, Uint8Array];

export class TransferBillToDustCollectorAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly value: bigint,
    public readonly targetUnitId: IUnitId,
    private readonly _targetUnitBacklink: Uint8Array,
    private readonly _backlink: Uint8Array,
  ) {
    this.value = BigInt(this.value);
    this._targetUnitBacklink = new Uint8Array(this._targetUnitBacklink);
    this._backlink = new Uint8Array(this._backlink);
  }

  public get payloadType(): PayloadType {
    return PayloadType.TransferBillToDustCollectorAttributes;
  }

  public get targetUnitBacklink(): Uint8Array {
    return new Uint8Array(this._targetUnitBacklink);
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public toOwnerProofData(): TransferBillToDustCollectorAttributesArray {
    return this.toArray();
  }

  public toArray(): TransferBillToDustCollectorAttributesArray {
    return [this.value, this.targetUnitId.bytes, this.targetUnitBacklink, this.backlink];
  }

  public toString(): string {
    return dedent`
      TransferBillToDustCollectorAttributes
        Value: ${this.value}
        Target Unit ID: ${this.targetUnitId.toString()}
        Target Unit Backlink: ${Base16Converter.encode(this._targetUnitBacklink)}
        Backlink: ${Base16Converter.encode(this._backlink)}`;
  }

  public static fromArray(data: TransferBillToDustCollectorAttributesArray): TransferBillToDustCollectorAttributes {
    return new TransferBillToDustCollectorAttributes(data[0], UnitId.fromBytes(data[1]), data[2], data[3]);
  }
}
