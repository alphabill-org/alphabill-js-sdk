import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { IPredicate } from './IPredicate.js';

export class TransferBillAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly targetPredicate: IPredicate,
    public readonly targetValue: bigint,
    public readonly backlink: Uint8Array,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [this.targetPredicate.getBytes(), this.targetValue, this.backlink];
  }
}
