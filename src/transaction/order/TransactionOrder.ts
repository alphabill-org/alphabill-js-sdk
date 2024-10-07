import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrderType } from '../TransactionOrderType';
import { TransactionPayload } from '../TransactionPayload.js';

/**
 * Transaction order.
 * @template T - Transaction payload type.
 */
export class TransactionOrder<Attributes extends ITransactionPayloadAttributes, TransactionProof> {
  /**
   * Transaction order constructor.
   * @param {TransactionOrderType} type Transaction type
   * @param {T} payload Payload.
   * @param {U} transactionProof Transaction proof.
   * @param {Uint8Array | null} _feeProof Fee proof.
   * @param {Uint8Array | null} stateUnlock State unlock.
   */
  public constructor(
    public readonly type: TransactionOrderType,
    public readonly payload: TransactionPayload<Attributes>,
    public readonly transactionProof: TransactionProof | null,
    private readonly _feeProof: Uint8Array | null,
    public readonly stateUnlock: IPredicate | null,
  ) {
    this._feeProof = this._feeProof ? new Uint8Array(this._feeProof) : null;
  }

  /**
   * Get fee proof.
   * @returns {Uint8Array | null} Fee proof.
   */
  public get feeProof(): Uint8Array | null {
    return this._feeProof ? new Uint8Array(this._feeProof) : null;
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionOrder
        ${this.payload.toString()}
        Transaction Proof: ${this.transactionProof?.toString() ?? null}
        Fee Proof: ${this._feeProof ? Base16Converter.encode(this._feeProof) : null}
        State Unlock: ${this.stateUnlock?.toString() ?? null}`;
  }
}
