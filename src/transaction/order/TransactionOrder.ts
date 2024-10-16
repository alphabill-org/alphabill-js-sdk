import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { IPredicate } from '../predicates/IPredicate.js';
import { ITransactionOrderProof } from '../proofs/ITransactionOrderProof.js';
import { PayloadArray, TransactionPayload } from '../TransactionPayload.js';

type StateUnlockType = Uint8Array | null;
type AuthProofType = unknown;
type FeeProofType = Uint8Array | null;

export type TransactionOrderArray = readonly [...PayloadArray, StateUnlockType, AuthProofType, FeeProofType];

/**
 * Transaction order.
 * @template T - Transaction payload type.
 */
export abstract class TransactionOrder<
  Attributes extends ITransactionPayloadAttributes,
  AuthProof extends ITransactionOrderProof,
> {
  /**
   * Transaction order constructor.
   * @param {TransactionPayload<Attributes>} payload Payload.
   * @param {ITransactionOrderProof} authProof Transaction proof.
   * @param {Uint8Array} _feeProof Fee proof.
   * @param {Uint8Array | null} stateUnlock State unlock.
   */
  protected constructor(
    public readonly payload: TransactionPayload<Attributes>,
    public readonly authProof: AuthProof,
    private readonly _feeProof: Uint8Array | null,
    public readonly stateUnlock: IPredicate | null,
  ) {
    this._feeProof = _feeProof ? new Uint8Array(_feeProof) : null;
  }

  public get feeProof(): Uint8Array | null {
    return this._feeProof ? new Uint8Array(this._feeProof) : null;
  }

  // TODO: Fix authproof logging
  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionOrder
        ${this.payload.toString()}
        Auth Proof: ${this.authProof?.toString() ?? null}
        Fee Proof: ${this._feeProof ? Base16Converter.encode(this._feeProof) : null}
        State Unlock: ${this.stateUnlock?.toString() ?? null}`;
  }

  public async encode(cborCodec: ICborCodec): Promise<TransactionOrderArray> {
    return [
      ...(await this.payload.encode(cborCodec)),
      this.stateUnlock?.bytes ?? null,
      await this.authProof.encode(),
      this.feeProof,
    ];
  }
}
