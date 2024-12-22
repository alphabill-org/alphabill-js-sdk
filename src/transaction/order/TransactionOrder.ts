import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { CborTag } from '../../codec/cbor/CborTag.js';
import { UnitId } from '../../UnitId.js';
import { Base16Converter } from '../../util/Base16Converter.js';
import { dedent } from '../../util/StringUtils.js';
import { ClientMetadata } from '../ClientMetadata.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { IPredicate } from '../predicates/IPredicate.js';
import { PredicateBytes } from '../predicates/PredicateBytes.js';
import { ITransactionOrderProof } from '../proofs/ITransactionOrderProof.js';
import { StateLock } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';

/**
 * Transaction order.
 * @template T - Transaction payload type.
 */
export class TransactionOrder<
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
  public constructor(
    public readonly version: bigint,
    public readonly payload: NoInfer<TransactionPayload<Attributes>>,
    public readonly stateUnlock: IPredicate | null,
    public readonly authProof: NoInfer<AuthProof>,
    private readonly _feeProof: Uint8Array | null,
  ) {
    this.version = BigInt(version);
    this._feeProof = _feeProof ? new Uint8Array(_feeProof) : null;
  }

  public get feeProof(): Uint8Array | null {
    return this._feeProof ? new Uint8Array(this._feeProof) : null;
  }

  public static fromCbor<
    Attributes extends ITransactionPayloadAttributes,
    AuthProof extends ITransactionOrderProof | null,
  >(
    bytes: Uint8Array,
    attributesFactory: { fromCbor: (bytes: Uint8Array) => Attributes },
    authProofFactory: { fromCbor: (bytes: Uint8Array) => AuthProof },
  ): TransactionOrder<Attributes, AuthProof> {
    const tag = CborDecoder.readTag(bytes);
    const data = CborDecoder.readArray(tag.data);
    return new TransactionOrder(
      CborDecoder.readUnsignedInteger(data[0]),
      new TransactionPayload(
        Number(CborDecoder.readUnsignedInteger(data[1])),
        Number(CborDecoder.readUnsignedInteger(data[2])),
        UnitId.fromBytes(CborDecoder.readByteString(data[3])),
        Number(CborDecoder.readUnsignedInteger(data[4])),
        attributesFactory.fromCbor(data[5]),
        CborDecoder.readOptional(data[6], StateLock.fromCbor),
        ClientMetadata.fromCbor(data[7]),
      ),
      CborDecoder.readOptional(data[8], PredicateBytes.fromCbor),
      authProofFactory.fromCbor(data[9]),
      CborDecoder.readOptional(data[10], CborDecoder.readByteString),
    );
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
