import { TransactionPayload } from './TransactionPayload.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export class TransactionOrder<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  public constructor(
    public readonly payload: T,
    public readonly ownerProof: Uint8Array,
    public readonly feeProof: Uint8Array,
    public readonly bytes: Uint8Array,
  ) {}

  public getBytes(): Uint8Array {
    return new Uint8Array(this.bytes);
  }

  public values(): unknown[] {
    return [this.payload.toArray(), this.ownerProof, this.feeProof];
  }
}
