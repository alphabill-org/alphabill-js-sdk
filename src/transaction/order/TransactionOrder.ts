import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { IPredicate } from '../predicate/IPredicate.js';
import { ITransactionOrderProof } from '../proof/ITransactionOrderProof.js';
import { StateLockArray } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';
import { ClientMetadata } from '../ClientMetadata.js';

type UnitIdType = Uint8Array;
type TransactionAttributesType = unknown;
type TransactionOrderType = number;
type StateUnlockType = Uint8Array | null;
type TransactionProofType = Uint8Array | null;
type FeeProofType = Uint8Array | null;

export type TransactionClientMetadataArray = [bigint, bigint, Uint8Array | null, Uint8Array | null];

export type TransactionOrderArray = readonly [
  NetworkIdentifier,
  SystemIdentifier,
  UnitIdType,
  TransactionOrderType,
  TransactionAttributesType,
  StateLockArray | null,
  TransactionClientMetadataArray,
  StateUnlockType,
  TransactionProofType,
  FeeProofType,
];

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
   * @param {TransactionOrderType} type Transaction type
   * @param {TransactionPayload<Attributes>} payload Payload.
   * @param {AuthProof | null} authProof Transaction proof.
   * @param {FeeProof | null} feeProof Fee proof.
   * @param {Uint8Array | null} stateUnlock State unlock.
   */
  protected constructor(
    public readonly type: number,
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
    return [
      this.payload.networkIdentifier,
      this.payload.systemIdentifier,
      this.payload.unitId.bytes,
      this.type,
      await this.payload.attributes.encode(cborCodec),
      this.payload.stateLock ? this.payload.stateLock.encode() : null,
      ClientMetadata.encode(this.payload.clientMetadata),
      this.stateUnlock?.bytes ?? null,
      (await this.authProof?.encode(cborCodec)) ?? null,
      (await this.feeProof?.encode(cborCodec)) ?? null,
    ];
  }
}
