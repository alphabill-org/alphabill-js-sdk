import { SystemIdentifier } from '../SystemIdentifier.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { FeeCreditUnitId } from './FeeCreditUnitId.js';

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

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
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
}
