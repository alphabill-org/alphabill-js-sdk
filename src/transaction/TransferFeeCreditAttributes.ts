import { IUnitId } from '../IUnitId.js';
import { SystemIdentifier } from '../SystemIdentifier.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';

export type TransferFeeCreditAttributesArray = readonly [
  bigint,
  SystemIdentifier,
  Uint8Array,
  bigint,
  bigint,
  Uint8Array | null,
  Uint8Array,
];

export class TransferFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly amount: bigint,
    public readonly targetSystemIdentifier: SystemIdentifier,
    public readonly targetUnitId: IUnitId,
    public readonly earliestAdditionTime: bigint,
    public readonly latestAdditionTime: bigint,
    private readonly _targetUnitBacklink: Uint8Array | null,
    private readonly _backlink: Uint8Array,
  ) {
    this.amount = BigInt(this.amount);
    this.earliestAdditionTime = BigInt(this.earliestAdditionTime);
    this.latestAdditionTime = BigInt(this.latestAdditionTime);
    this._targetUnitBacklink = this._targetUnitBacklink ? new Uint8Array(this._targetUnitBacklink) : null;
    this._backlink = new Uint8Array(this._backlink);
  }

  public get payloadType(): PayloadType {
    return PayloadType.TransferFeeCreditAttributes;
  }

  public get targetUnitBacklink(): Uint8Array | null {
    return this._targetUnitBacklink ? new Uint8Array(this._targetUnitBacklink) : null;
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public toOwnerProofData(): TransferFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): TransferFeeCreditAttributesArray {
    return [
      this.amount,
      this.targetSystemIdentifier,
      this.targetUnitId.bytes,
      this.earliestAdditionTime,
      this.latestAdditionTime,
      this.targetUnitBacklink,
      this.backlink,
    ];
  }

  public toString(): string {
    return dedent`
      TransferFeeCreditAttributes
        Amount: ${this.amount}
        Target System Identifier: ${this.targetSystemIdentifier.toString()}
        Target Unit ID: ${this.targetUnitId.toString()}
        Earliest Addition Time: ${this.earliestAdditionTime}
        Latest Addition Time: ${this.latestAdditionTime}
        Target Unit Backlink: ${
          this._targetUnitBacklink === null ? 'null' : Base16Converter.encode(this._targetUnitBacklink)
        }
        Backlink: ${Base16Converter.encode(this._backlink)}`;
  }

  public static fromArray(data: TransferFeeCreditAttributesArray): TransferFeeCreditAttributes {
    return new TransferFeeCreditAttributes(
      data[0],
      data[1],
      UnitId.fromBytes(data[2]),
      data[3],
      data[4],
      data[5],
      data[6],
    );
  }
}
