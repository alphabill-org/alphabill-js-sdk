import { CborEncoder } from '../../codec/cbor/CborEncoder.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../order/TransactionOrder.js';
import { ITransactionOrderProof } from '../proofs/ITransactionOrderProof.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord } from './TransactionRecord.js';

/**
 * Transaction record with proof.
 * @template T - Transaction payload type.
 */
export class TransactionRecordWithProof<
  T extends TransactionOrder<ITransactionPayloadAttributes, ITransactionOrderProof>,
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
    return CborEncoder.encodeTag(
      1015,
      CborEncoder.encodeArray([this.transactionRecord.encode(), this.transactionProof.encode()]),
    );
  }
}
