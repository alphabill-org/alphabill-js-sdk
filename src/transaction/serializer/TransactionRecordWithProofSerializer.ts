import { ServerMetadata } from '../../ServerMetadata.js';
import { TransactionProof, TransactionProofArray } from '../../TransactionProof.js';
import { TransactionProofChainItem } from '../../TransactionProofChainItem.js';
import { TransactionRecord } from '../../TransactionRecord.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../../TransactionRecordWithProof.js';
import { ITransactionPayloadAttributes } from '../ITransactionPayloadAttributes.js';
import { TransactionOrderArray } from '../order/TransactionOrderArray.js';
import { TransactionOrderSerializer } from './TransactionOrderSerializer.js';

/**
 * Transaction record array.
 */
export type TransactionRecordArray = readonly [TransactionOrderArray, ServerMetadataArray];

/**
 * Server metadata array.
 */
export type ServerMetadataArray = readonly [bigint, Uint8Array[], bigint, Uint8Array | null];

export class TransactionRecordWithProofSerializer {
  public static async fromArray<Attributes extends ITransactionPayloadAttributes, Proof>(
    [transactionRecord, transactionProof]: TransactionRecordWithProofArray,
    transactionOrderSerializer: TransactionOrderSerializer<Attributes, Proof>,
  ): Promise<TransactionRecordWithProof<Attributes, Proof>> {
    return new TransactionRecordWithProof(
      await this.createTransactionRecordObjectFromArray(transactionRecord, transactionOrderSerializer),
      this.createTransactionProofObjectFromArray(transactionProof),
    );
  }

  public static async toArray<Attributes extends ITransactionPayloadAttributes, Proof>(
    { transactionRecord, transactionProof }: TransactionRecordWithProof<Attributes, Proof>,
    transactionOrderSerializer: TransactionOrderSerializer<Attributes, Proof>,
  ): Promise<TransactionRecordWithProofArray> {
    return [
      await this.createTransactionRecordArrayFromObject(transactionRecord, transactionOrderSerializer),
      this.createTransactionProofArrayFromObject(transactionProof),
    ];
  }

  private static async createTransactionRecordObjectFromArray<Attributes extends ITransactionPayloadAttributes, Proof>(
    transactionRecord: TransactionRecordArray,
    transactionOrderSerializer: TransactionOrderSerializer<Attributes, Proof>,
  ): Promise<TransactionRecord<Attributes, Proof>> {
    return new TransactionRecord(
      await transactionOrderSerializer.fromArray(transactionRecord[0]),
      TransactionRecordWithProofSerializer.createServerMetadataObjectFromArray(transactionRecord[1]),
    );
  }

  private static async createTransactionRecordArrayFromObject<Attributes extends ITransactionPayloadAttributes, Proof>(
    transactionRecord: TransactionRecord<Attributes, Proof>,
    transactionOrderSerializer: TransactionOrderSerializer<Attributes, Proof>,
  ): Promise<TransactionRecordArray> {
    return [
      await transactionOrderSerializer.toArray(transactionRecord.transactionOrder),
      TransactionRecordWithProofSerializer.createServerMetadataArrayFromObject(transactionRecord.serverMetadata),
    ];
  }

  private static createTransactionProofObjectFromArray(transactionProof: TransactionProofArray): TransactionProof {
    return new TransactionProof(
      transactionProof[0],
      transactionProof[1].map((item) => TransactionProofChainItem.fromArray(item)),
      transactionProof[2],
    );
  }

  private static createTransactionProofArrayFromObject(transactionProof: TransactionProof): TransactionProofArray {
    return [
      transactionProof.blockHeaderHash,
      transactionProof.chain.map((item) => [item.hash, item.left]),
      transactionProof.unicityCertificate,
    ];
  }

  private static createServerMetadataObjectFromArray([
    actualFee,
    targetUnits,
    successIndicator,
    processingDetails,
  ]: ServerMetadataArray): ServerMetadata {
    return new ServerMetadata(actualFee, targetUnits, successIndicator, processingDetails);
  }

  private static createServerMetadataArrayFromObject({
    actualFee,
    targetUnits,
    successIndicator,
    processingDetails,
  }: ServerMetadata): ServerMetadataArray {
    return [actualFee, targetUnits, successIndicator, processingDetails];
  }
}
