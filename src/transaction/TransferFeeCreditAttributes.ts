import { SystemIdentifier } from '../SystemIdentifier.js';
import { UnitId } from '../UnitId.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { FeeCreditUnitId } from './FeeCreditUnitId.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type TransferFeeCreditAttributesArray = readonly [
  bigint,
  SystemIdentifier,
  Uint8Array,
  bigint,
  bigint,
  Uint8Array | null,
  Uint8Array,
];

@PayloadAttribute
export class TransferFeeCreditAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'transFC';
  }

  public constructor(
    public readonly amount: bigint,
    public readonly targetSystemIdentifier: SystemIdentifier,
    public readonly targetUnitId: FeeCreditUnitId,
    public readonly earliestAdditionTime: bigint,
    public readonly latestAdditionTime: bigint,
    public readonly targetUnitBacklink: Uint8Array | null,
    public readonly backlink: Uint8Array,
  ) {}

  public toOwnerProofData(): TransferFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): TransferFeeCreditAttributesArray {
    return [
      this.amount,
      this.targetSystemIdentifier,
      this.targetUnitId.getBytes(),
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
          this.targetUnitBacklink === null ? 'null' : Base16Converter.encode(this.targetUnitBacklink)
        }
        Backlink: ${Base16Converter.encode(this.backlink)}`;
  }

  public static fromArray(data: TransferFeeCreditAttributesArray): TransferFeeCreditAttributes {
    return new TransferFeeCreditAttributes(
      BigInt(data[0]),
      data[1],
      UnitId.fromBytes(new Uint8Array(data[2])) as FeeCreditUnitId,
      BigInt(data[3]),
      BigInt(data[4]),
      data[5] ? new Uint8Array(data[5]) : null,
      new Uint8Array(data[6]),
    );
  }
}
