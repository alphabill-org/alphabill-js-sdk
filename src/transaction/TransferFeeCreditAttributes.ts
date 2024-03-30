import { SystemIdentifier } from '../SystemIdentifier.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { FeeCreditUnitId } from './FeeCreditUnitId.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

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
}
