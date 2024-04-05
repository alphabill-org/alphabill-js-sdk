import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { TransactionProof, TransactionProofArray } from './TransactionProof.js';
import { TransactionRecord, TransactionRecordArray } from './TransactionRecord.js';
import { dedent } from './util/StringUtils.js';

export type TransactionRecordWithProofArray = readonly [TransactionRecordArray, TransactionProofArray];

export class TransactionRecordWithProof<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  public constructor(
    private readonly transactionRecord: TransactionRecord<T>,
    private readonly transactionProof: TransactionProof,
  ) {}

  public getTransactionRecord(): TransactionRecord<T> {
    return this.transactionRecord;
  }

  public getTransactionProof(): TransactionProof {
    return this.transactionProof;
  }

  public toArray(): TransactionRecordWithProofArray {
    return [this.getTransactionRecord().toArray(), this.getTransactionProof().toArray()];
  }

  public toString(): string {
    return dedent`
      TransactionRecordWithProof
        ${this.transactionRecord.toString()}
        ${this.transactionProof.toString()}`;
  }

  public static fromArray<T extends ITransactionPayloadAttributes>(
    data: TransactionRecordWithProofArray,
  ): TransactionRecordWithProof<TransactionPayload<T>> {
    return new TransactionRecordWithProof(TransactionRecord.fromArray(data[0]), TransactionProof.fromArray(data[1]));
  }
}
