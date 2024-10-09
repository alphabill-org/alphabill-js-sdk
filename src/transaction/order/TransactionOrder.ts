import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { NetworkIdentifier } from '../../NetworkIdentifier.js';
import { SystemIdentifier } from '../../SystemIdentifier.js';
import { UnitId } from '../../UnitId.js';
import { dedent } from '../../util/StringUtils.js';
import { IPredicate } from '../IPredicate.js';
import { ITransactionClientMetadata } from '../ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { ITransactionOrderProof } from '../proof/ITransactionOrderProof.js';
import { StateLockArray } from '../StateLock.js';
import { TransactionPayload } from '../TransactionPayload.js';

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
export abstract class TransactionOrder<Attributes extends ITransactionPayloadAttributes, TransactionProof extends ITransactionOrderProof, FeeProof extends ITransactionOrderProof> {
  /**
   * Transaction order constructor.
   * @param {TransactionOrderType} type Transaction type
   * @param {TransactionPayload<Attributes>} payload Payload.
   * @param {TransactionProof | null} transactionProof Transaction proof.
   * @param {FeeProof | null} feeProof Fee proof.
   * @param {Uint8Array | null} stateUnlock State unlock.
   */
  public constructor(
    public readonly type: number,
    public readonly payload: TransactionPayload<Attributes>,
    public readonly transactionProof: TransactionProof | null,
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
        Transaction Proof: ${this.transactionProof?.toString() ?? null}
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
      TransactionOrder.encodeClientMetadata(this.payload.clientMetadata),
      this.stateUnlock?.bytes ?? null,
      await this.transactionProof?.encode(cborCodec) ?? null,
      await this.feeProof?.encode(cborCodec) ?? null
    ];
  }

  public static encodeClientMetadata({
                                       timeout,
                                       maxTransactionFee,
                                       feeCreditRecordId,
                                       referenceNumber,
                                     }: ITransactionClientMetadata): TransactionClientMetadataArray {
    return [timeout, maxTransactionFee, feeCreditRecordId?.bytes ?? null, referenceNumber];
  }

  public static decodeClientMetadata([
                            timeout,
                            maxTransactionFee,
                            feeCreditRecordId,
                            referenceNumber,
                          ]: TransactionClientMetadataArray): ITransactionClientMetadata {
    return {
      timeout,
      maxTransactionFee,
      feeCreditRecordId: feeCreditRecordId ? UnitId.fromBytes(feeCreditRecordId) : null,
      referenceNumber,
    };
  }
}
