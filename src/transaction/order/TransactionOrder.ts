import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { ITransactionOrderProof } from '../proof/ITransactionOrderProof.js';
import { PayloadArray, TransactionPayload } from '../TransactionPayload.js';

export type UnitIdType = Uint8Array;
export type TransactionAttributesType = unknown;
type StateUnlockType = Uint8Array | null;
type TransactionProofType = Uint8Array | null;
type FeeProofType = Uint8Array | null;

export type TransactionClientMetadataArray = [bigint, bigint, Uint8Array | null, Uint8Array | null];

export type TransactionOrderArray = readonly [PayloadArray, StateUnlockType, TransactionProofType, FeeProofType];

/**
 * Transaction order.
 * @template T - Transaction payload type.
 */
export abstract class TransactionOrder<
  Attributes extends ITransactionPayloadAttributes,
  AuthProof extends ITransactionOrderProof,
  FeeProof extends ITransactionOrderProof,
> {
  /**
   * Transaction order constructor.
   * @param {TransactionPayload<Attributes>} payload Payload.
   * @param {AuthProof | null} authProof Transaction proof.
   * @param {FeeProof | null} feeProof Fee proof.
   * @param {Uint8Array | null} stateUnlock State unlock.
   */
  protected constructor(
    public readonly payload: TransactionPayload<Attributes>,
    public readonly authProof: AuthProof | null,
    public readonly feeProof: FeeProof | null,
    public readonly stateUnlock: IPredicate | null,
  ) {}

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionOrder
        ${this.payload.toString()}
        Auth Proof: ${this.authProof?.toString() ?? null}
        Fee Proof: ${this.feeProof?.toString() ?? null}
        State Unlock: ${this.stateUnlock?.toString() ?? null}`;
  }

  public async encode(cborCodec: ICborCodec): Promise<TransactionOrderArray> {
    const payloadArray: PayloadArray = await this.payload.encode(cborCodec);
    const txoBytes: [StateUnlockType, TransactionProofType, FeeProofType] = [
      this.stateUnlock?.bytes ?? null,
      (await this.authProof?.encode(cborCodec)) ?? null,
      (await this.feeProof?.encode(cborCodec)) ?? null,
    ];
    return [payloadArray, ...txoBytes];
  }
}
