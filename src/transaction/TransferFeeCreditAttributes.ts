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
    private readonly amount: bigint,
    private readonly targetSystemIdentifier: SystemIdentifier,
    private readonly targetUnitId: FeeCreditUnitId,
    private readonly earliestAdditionTime: bigint,
    private readonly latestAdditionTime: bigint,
    private readonly targetUnitBacklink: Uint8Array | null,
    private readonly backlink: Uint8Array,
  ) {
    this.amount = BigInt(this.amount);
    this.earliestAdditionTime = BigInt(this.earliestAdditionTime);
    this.latestAdditionTime = BigInt(this.latestAdditionTime);
    this.targetUnitBacklink = this.targetUnitBacklink ? new Uint8Array(this.targetUnitBacklink) : null;
    this.backlink = new Uint8Array(this.backlink);
  }

  public getAmount(): bigint {
    return this.amount;
  }

  public getTargetSystemIdentifier(): SystemIdentifier {
    return this.targetSystemIdentifier;
  }

  public getTargetUnitId(): FeeCreditUnitId {
    return this.targetUnitId;
  }

  public getEarliestAdditionTime(): bigint {
    return this.earliestAdditionTime;
  }

  public getLatestAdditionTime(): bigint {
    return this.latestAdditionTime;
  }

  public getTargetUnitBacklink(): Uint8Array | null {
    return this.targetUnitBacklink ? new Uint8Array(this.targetUnitBacklink) : null;
  }

  public getBacklink(): Uint8Array {
    return new Uint8Array(this.backlink);
  }

  public toOwnerProofData(): TransferFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): TransferFeeCreditAttributesArray {
    return [
      this.getAmount(),
      this.getTargetSystemIdentifier(),
      this.getTargetUnitId().getBytes(),
      this.getEarliestAdditionTime(),
      this.getLatestAdditionTime(),
      this.getTargetUnitBacklink(),
      this.getBacklink(),
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
      data[0],
      data[1],
      UnitId.fromBytes(data[2]) as FeeCreditUnitId,
      data[3],
      data[4],
      data[5],
      data[6],
    );
  }
}
