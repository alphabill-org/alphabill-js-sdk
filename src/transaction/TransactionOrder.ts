import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionPayload, TransactionPayloadArray } from './TransactionPayload.js';

export type TransactionOrderArray = readonly [TransactionPayloadArray, Uint8Array, Uint8Array | null];

export class TransactionOrder<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  public constructor(
    private readonly payload: T,
    private readonly ownerProof: Uint8Array,
    private readonly feeProof: Uint8Array | null,
  ) {
    this.ownerProof = new Uint8Array(this.ownerProof);
    this.feeProof = this.feeProof ? new Uint8Array(this.feeProof) : null;
  }

  public getPayload(): T {
    return this.payload;
  }

  public getOwnerProof(): Uint8Array {
    return new Uint8Array(this.ownerProof);
  }

  public getFeeProof(): Uint8Array | null {
    return this.feeProof ? new Uint8Array(this.feeProof) : null;
  }

  public toArray(): TransactionOrderArray {
    return [this.getPayload().toArray(), this.getOwnerProof(), this.getFeeProof()];
  }

  public toString(): string {
    return dedent`
      TransactionOrder
        ${this.payload.toString()}
        Owner Proof: ${Base16Converter.encode(this.ownerProof)}
        Fee Proof: ${this.feeProof ? Base16Converter.encode(this.feeProof) : null}`;
  }

  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionOrderArray,
  ): TransactionOrder<TransactionPayload<T>> {
    return new TransactionOrder(TransactionPayload.fromArray(data[0]), data[1], data[2]);
  }
}
