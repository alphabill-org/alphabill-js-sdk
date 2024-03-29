import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export class UnlockFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(public readonly backlink: Uint8Array) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [this.backlink];
  }
}
