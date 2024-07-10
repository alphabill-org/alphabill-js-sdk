import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionPayload, TransactionPayloadArray } from './TransactionPayload.js';

/**
 * Transaction order array.
 */
export type TransactionOrderArray = readonly [
  TransactionPayloadArray,
  Uint8Array | null,
  Uint8Array | null,
  Uint8Array | null,
];

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
   * @param {Uint8Array | null} _stateUnlock - State unlock.
   */
  public constructor(
    public readonly payload: T,
    private readonly _ownerProof: Uint8Array | null,
    private readonly _feeProof: Uint8Array | null,
    private readonly _stateUnlock: Uint8Array | null,
  ) {
    this._ownerProof = this._ownerProof ? new Uint8Array(this._ownerProof) : null;
    this._feeProof = this._feeProof ? new Uint8Array(this._feeProof) : null;
    this._stateUnlock = this._stateUnlock ? new Uint8Array(this._stateUnlock) : null;
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
   * Get state unlock.
   * @returns {Uint8Array | null} State unlock.
   */
  public get stateUnlock(): Uint8Array | null {
    return this._stateUnlock ? new Uint8Array(this._stateUnlock) : null;
  }

  /**
   * Convert to array.
   * @returns {TransactionOrderArray} Transaction order array.
   */
  public toArray(): TransactionOrderArray {
    return [this.payload.toArray(), this.ownerProof, this.feeProof, this.stateUnlock];
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
        Fee Proof: ${this._feeProof ? Base16Converter.encode(this._feeProof) : null}
        State Unlock: ${this._stateUnlock ? Base16Converter.encode(this._stateUnlock) : null}`;
  }

  /**
   * Create TransactionOrder from array.
   * @param {TransactionOrderArray} data - Transaction order array.
   * @returns {TransactionOrder} Transaction order instance.
   */
  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionOrderArray,
  ): TransactionOrder<TransactionPayload<T>> {
    return new TransactionOrder(TransactionPayload.fromArray(data[0]), data[1], data[2], data[3]);
  }
}
