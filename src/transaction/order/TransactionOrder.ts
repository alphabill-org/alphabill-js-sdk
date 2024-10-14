import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { ITransactionOrderProof } from '../proof/ITransactionOrderProof.js';
import { PayloadArray, TransactionPayload } from '../TransactionPayload.js';

type StateUnlockType = Uint8Array | null;
type AuthProofType = Uint8Array;
type FeeProofType = Uint8Array;

export type TransactionClientMetadataArray = [bigint, bigint, Uint8Array | null, Uint8Array | null];

export type TransactionOrderArray = readonly [PayloadArray, StateUnlockType, AuthProofType, FeeProofType];

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
   * @param {ITransactionOrderProof} authProof Transaction proof.
   * @param {ITransactionOrderProof} feeProof Fee proof.
   * @param {Uint8Array | null} stateUnlock State unlock.
   */
  protected constructor(
    public readonly payload: TransactionPayload<Attributes>,
    public readonly authProof: AuthProof,
    public readonly feeProof: FeeProof,
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
        Auth Proof: ${this.authProof.toString()}
        Fee Proof: ${this.feeProof.toString()}
        State Unlock: ${this.stateUnlock?.toString() ?? null}`;
  }

  public async encode(cborCodec: ICborCodec): Promise<TransactionOrderArray> {
    const payloadArray: PayloadArray = await this.payload.encode(cborCodec);
    // TODO: Rename
    const txoBytes: [StateUnlockType, AuthProofType, FeeProofType] = [
      this.stateUnlock?.bytes ?? null,
      await this.authProof.encode(cborCodec),
      await this.feeProof.encode(cborCodec),
    ];
    return [payloadArray, ...txoBytes];
  }
}
