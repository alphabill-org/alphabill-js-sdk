import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export class LockFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly lockStatus: bigint,
    public readonly backlink: Uint8Array,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [this.lockStatus, this.backlink];
  }
}
