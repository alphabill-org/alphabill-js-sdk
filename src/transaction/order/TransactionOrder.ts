import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { CborTag } from '../../codec/cbor/CborTag.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { IPredicate } from '../predicates/IPredicate.js';
import { ITransactionOrderProof } from '../proofs/ITransactionOrderProof.js';
import { TransactionPayload } from '../TransactionPayload.js';

/**
 * Transaction order.
 * @template T - Transaction payload type.
 */
export abstract class TransactionOrder<
  Attributes extends ITransactionPayloadAttributes,
  AuthProof extends ITransactionOrderProof | null,
> {
  /**
   * Transaction order constructor.
   * @template Attributes Attributes type.
   * @param {bigint} version - version.
   * @param {TransactionPayload<Attributes>} payload Payload.
   * @param {ITransactionOrderProof} authProof Transaction proof.
   * @param {Uint8Array} _feeProof Fee proof.
   * @param {Uint8Array | null} stateUnlock State unlock.
   */
  protected constructor(
    public readonly version: bigint,
    public readonly payload: TransactionPayload<Attributes>,
    public readonly stateUnlock: IPredicate | null,
    public readonly authProof: AuthProof,
    private readonly _feeProof: Uint8Array | null,
  ) {
    this.version = BigInt(version);
    this._feeProof = _feeProof ? new Uint8Array(_feeProof) : null;
  }

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
        Version: ${this.version}
        ${this.payload.toString()}
        State Unlock: ${this.stateUnlock?.toString() ?? null}
        ${this.authProof?.toString() ?? `Auth Proof: null`}
        Fee Proof: ${this._feeProof ? Base16Converter.encode(this._feeProof) : null}`;
  }

  public encode(): Uint8Array {
    return CborEncoder.encodeTag(
      CborTag.TRANSACTION_ORDER,
      CborEncoder.encodeArray([
        CborEncoder.encodeUnsignedInteger(this.version),
        ...this.payload.encode(),
        this.stateUnlock ? CborEncoder.encodeByteString(this.stateUnlock.bytes) : CborEncoder.encodeNull(),
        this.authProof ? this.authProof.encode() : CborEncoder.encodeNull(),
        this.feeProof ? CborEncoder.encodeByteString(this.feeProof) : CborEncoder.encodeNull(),
      ]),
    );
  }
}
