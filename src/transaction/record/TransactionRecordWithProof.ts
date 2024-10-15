import { ICborCodec } from '../../codec/cbor/ICborCodec.js';
import { dedent } from '../../util/StringUtils.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrder } from '../order/TransactionOrder.js';
import { ITransactionOrderProof } from '../proof/ITransactionOrderProof.js';
import { TransactionProof } from './TransactionProof.js';
import { TransactionRecord, TransactionRecordArray } from './TransactionRecord.js';

/**
 * Transaction record with proof array.
 */
export type TransactionRecordWithProofArray = readonly [TransactionRecordArray, unknown];

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
   * Encode transaction record with proof to array.
   * @param {ICborCodec} cborCodec
   * @returns {TransactionRecordWithProofArray} Transaction record with proof array structure.
   */
  public async encode(cborCodec: ICborCodec): Promise<TransactionRecordWithProofArray> {
    return [
      [
        await this.transactionRecord.transactionOrder.encode(cborCodec),
        [
          this.transactionRecord.serverMetadata.actualFee,
          this.transactionRecord.serverMetadata.targetUnits,
          this.transactionRecord.serverMetadata.successIndicator,
          this.transactionRecord.serverMetadata.processingDetails,
        ],
      ],
      this.transactionProof.encode(),
    ];
  }
}
