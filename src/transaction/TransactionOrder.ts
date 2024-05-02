import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionPayload, TransactionPayloadArray } from './TransactionPayload.js';

/**
 * Transaction order array.
 */
export type TransactionOrderArray = readonly [TransactionPayloadArray, Uint8Array | null, Uint8Array | null];

/**
 * Transaction order.
 * @template T - Transaction payload type.
 */
export class TransactionOrder<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  /**
   * Transaction order constructor.
   * @param {T} payload - Payload.
   * @param {Uint8Array} _ownerProof - Owner proof.
   * @param {Uint8Array | null} _feeProof - Fee proof.
   */
  public constructor(
    public readonly payload: T,
    private readonly _ownerProof: Uint8Array | null,
    private readonly _feeProof: Uint8Array | null,
  ) {
    this._ownerProof = this._ownerProof ? new Uint8Array(this._ownerProof) : null;
    this._feeProof = this._feeProof ? new Uint8Array(this._feeProof) : null;
  }

  /**
   * Get owner proof.
   * @returns {Uint8Array | null} Owner proof.
   */
  public get ownerProof(): Uint8Array | null {
    return this._ownerProof ? new Uint8Array(this._ownerProof) : null;
  }

  /**
   * Get fee proof.
   * @returns {Uint8Array | null} Fee proof.
   */
  public get feeProof(): Uint8Array | null {
    return this._feeProof ? new Uint8Array(this._feeProof) : null;
  }

  /**
   * Convert to array.
   * @returns {TransactionOrderArray} Transaction order array.
   */
  public toArray(): TransactionOrderArray {
    return [this.payload.toArray(), this.ownerProof, this.feeProof];
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionOrder
        ${this.payload.toString()}
        Owner Proof: ${this._ownerProof ? Base16Converter.encode(this._ownerProof) : null}
        Fee Proof: ${this._feeProof ? Base16Converter.encode(this._feeProof) : null}`;
  }

  /**
   * Create TransactionOrder from array.
   * @param {TransactionOrderArray} data - Transaction order array.
   * @returns {TransactionOrder} Transaction order instance.
   */
  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionOrderArray,
  ): TransactionOrder<TransactionPayload<T>> {
    return new TransactionOrder(TransactionPayload.fromArray(data[0]), data[1], data[2]);
  }
}
