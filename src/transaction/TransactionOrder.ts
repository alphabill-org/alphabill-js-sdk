import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionPayload, TransactionPayloadArray } from './TransactionPayload.js';

export type TransactionOrderArray = readonly [TransactionPayloadArray, Uint8Array, Uint8Array | null];
export class TransactionOrder<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  public constructor(
    public readonly payload: T,
    public readonly ownerProof: Uint8Array,
    public readonly feeProof: Uint8Array | null,
    private readonly bytes: Uint8Array,
  ) {}

  public getBytes(): Uint8Array {
    return new Uint8Array(this.bytes);
  }

  public toArray(): TransactionOrderArray {
    return [this.payload.toArray(), this.ownerProof, this.feeProof];
  }

  public toString(): string {
    return dedent`
      TransactionOrder
        ${this.payload.toString()}
        Owner Proof: ${Base16Converter.encode(this.ownerProof)}
        Fee Proof: ${this.feeProof ? Base16Converter.encode(this.feeProof) : null}`;
  }
}
