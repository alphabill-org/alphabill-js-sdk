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
  ) {}

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

  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionOrderArray,
  ): TransactionOrder<TransactionPayload<T>> {
    return new TransactionOrder(
      TransactionPayload.fromArray(data[0]),
      new Uint8Array(data[1]),
      data[2] ? new Uint8Array(data[2]) : null,
    );
  }
}
