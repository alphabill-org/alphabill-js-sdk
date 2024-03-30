import { ITransactionPayloadAttributes } from './transaction/ITransactionPayloadAttributes.js';
import { TransactionPayload } from './transaction/TransactionPayload.js';
import { TransactionProof, TransactionProofArray } from './TransactionProof.js';
import { TransactionRecord, TransactionRecordArray } from './TransactionRecord.js';
import { dedent } from './util/StringUtils.js';

export type TransactionRecordWithProofArray = readonly [TransactionRecordArray, TransactionProofArray];
export class TransactionRecordWithProof<T extends TransactionPayload<ITransactionPayloadAttributes>> {
  public constructor(
    public readonly transactionRecord: TransactionRecord<T>,
    public readonly transactionProof: TransactionProof,
  ) {}

  public toArray(): TransactionRecordWithProofArray {
    return [this.transactionRecord.toArray(), this.transactionProof.toArray()];
  }

  public toString(): string {
    return dedent`
      TransactionRecordWithProof
        ${this.transactionRecord.toString()}
        ${this.transactionProof.toString()}`;
  }
}
