import { ICborCodec } from '../codec/cbor/ICborCodec.js';
import { PredicateBytes } from '../PredicateBytes.js';
import { ISigningService } from '../signing/ISigningService.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransactionPayload, TransactionPayloadArray } from './TransactionPayload.js';

export interface ITransactionOrderOwnerProofSigner {
  sign(transactionOrder: TransactionOrder<TransactionPayload<ITransactionPayloadAttributes>>): Promise<Uint8Array>;
}

export interface ITransactionOrderFeeProofSigner {
  sign(transactionOrder: TransactionOrder<TransactionPayload<ITransactionPayloadAttributes>>): Promise<Uint8Array>;
}

class TransactionOrderOwnerProofSigner implements ITransactionOrderOwnerProofSigner {
  public constructor(
    private readonly signingService: ISigningService,
    private readonly cborCodec: ICborCodec,
  ) {}

  public async sign(order: TransactionOrder<TransactionPayload<ITransactionPayloadAttributes>>): Promise<Uint8Array> {
    const signingBytes = await this.cborCodec.encode(order.payload.getSigningFields());

    return new Uint8Array(
      await this.cborCodec.encode([await this.signingService.sign(signingBytes), this.signingService.publicKey]),
    );
  }
}

class TransactionOrderFeeProofSigner implements ITransactionOrderFeeProofSigner {
  public constructor(
    private readonly signingService: ISigningService,
    private readonly cborCodec: ICborCodec,
  ) {}

  public async sign(order: TransactionOrder<TransactionPayload<ITransactionPayloadAttributes>>): Promise<Uint8Array> {
    const signingBytes = await this.cborCodec.encode(order.payload.toArray());

    return new Uint8Array(
      await this.cborCodec.encode([await this.signingService.sign(signingBytes), this.signingService.publicKey]),
    );
  }
}

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
    public readonly _stateUnlock: IPredicate | null,
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
    return [this.payload.toArray(), this.ownerProof, this.feeProof, this._stateUnlock?.bytes ?? null];
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
        State Unlock: ${this._stateUnlock?.toString() ?? null}`;
  }

  public async sign(
    ownerProofSigner: ITransactionOrderOwnerProofSigner,
    feeProofSigner: ITransactionOrderFeeProofSigner,
  ): Promise<TransactionOrder<T>> {
    const ownerProof = await ownerProofSigner.sign(this);
    const feeProof = await feeProofSigner.sign(new TransactionOrder(this.payload, ownerProof, null, this._stateUnlock));
    return new TransactionOrder(this.payload, ownerProof, feeProof, this._stateUnlock);
  }

  /**
   * Create TransactionOrder from array.
   * @param {TransactionOrderArray} data - Transaction order array.
   * @returns {TransactionOrder} Transaction order instance.
   */
  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionOrderArray,
  ): TransactionOrder<TransactionPayload<T>> {
    return new TransactionOrder(
      TransactionPayload.fromArray(data[0]),
      data[1],
      data[2],
      data[3] ? new PredicateBytes(data[3]) : null,
    );
  }
}
