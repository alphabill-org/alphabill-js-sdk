import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { IUnitId } from '../IUnitId.js';

export class TransferBillToDustCollectorAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly value: bigint,
    public readonly targetUnitId: IUnitId,
    public readonly targetUnitBacklink: Uint8Array,
    public readonly backlink: Uint8Array,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [this.value, this.targetUnitId.getBytes(), this.targetUnitBacklink, this.backlink];
  }
}
