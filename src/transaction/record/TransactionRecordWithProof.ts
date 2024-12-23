import { CborDecoder } from '../../codec/cbor/CborDecoder.js';
import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { ITransactionOrderProof } from '../proofs/ITransactionOrderProof.js';
import { TransactionOrder } from '../TransactionOrder.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';

/**
 * Transaction record with proof.
 * @template T - Transaction payload type.
 */
export class TransactionRecordWithProof<
  T extends TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof | null>,
> {
  /**
   * Transaction record with proof constructor.
   * @param {TransactionRecord<T>} transactionRecord - transaction record.
   * @param {TransactionProof} transactionProof - transaction proof.
   */
  public constructor(
    public readonly transactionRecord: TransactionRecord<T>,
    public readonly transactionProof: TransactionProof,
  ) {}

  public static fromCbor<
    Attributes extends ITransactionPayloadAttributes,
    AuthProof extends ITransactionOrderProof | null,
  >(
    bytes: Uint8Array,
    attributesFactory: { fromCbor: (bytes: Uint8Array) => Attributes },
    authProofFactory: { fromCbor: (bytes: Uint8Array) => AuthProof },
  ): TransactionRecordWithProof<TransactionOrder<Attributes, AuthProof>> {
    const data = CborDecoder.readArray(bytes);
    return new TransactionRecordWithProof(
      TransactionRecord.fromCbor(data[0], attributesFactory, authProofFactory),
      TransactionProof.fromCbor(data[1]),
    );
  }

  /**
   * Convert to string.
   * @returns {string} String representation.
   */
  public toString(): string {
    return dedent`
      TransactionRecordWithProof
        ${this.transactionRecord.toString()}
        ${this.transactionProof.toString()}`;
  }

  /**
   * Encode transaction record with proof to raw CBOR.
   * @returns {Uint8Array} Transaction record with proof as raw CBOR.
   */
  public encode(): Uint8Array {
    return CborEncoder.encodeArray([this.transactionRecord.encode(), this.transactionProof.encode()]);
  }
}
