import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionPayload, TransactionPayloadArray } from './TransactionPayload.js';

export type TransactionOrderArray = readonly [TransactionPayloadArray, Uint8Array, Uint8Array | null];

export class TransactionOrder<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  public constructor(
    public readonly payload: T,
    private readonly _ownerProof: Uint8Array,
    private readonly _feeProof: Uint8Array | null,
  ) {
    this._ownerProof = new Uint8Array(this._ownerProof);
    this._feeProof = this._feeProof ? new Uint8Array(this._feeProof) : null;
  }

  public get ownerProof(): Uint8Array {
    return new Uint8Array(this._ownerProof);
  }

  public get feeProof(): Uint8Array | null {
    return this._feeProof ? new Uint8Array(this._feeProof) : null;
  }

  public toArray(): TransactionOrderArray {
    return [this.payload.toArray(), this.ownerProof, this.feeProof];
  }

  public toString(): string {
    return dedent`
      TransactionOrder
        ${this.payload.toString()}
        Owner Proof: ${Base16Converter.encode(this._ownerProof)}
        Fee Proof: ${this._feeProof ? Base16Converter.encode(this._feeProof) : null}`;
  }

  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionOrderArray,
  ): TransactionOrder<TransactionPayload<T>> {
    return new TransactionOrder(TransactionPayload.fromArray(data[0]), data[1], data[2]);
  }
}
