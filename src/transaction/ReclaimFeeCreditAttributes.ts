import dedent from 'dedent';
import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { CloseFeeCreditPayload } from './CloseFeeCreditPayload.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';

export type ReclaimFeeCreditAttributesArray = [TransactionRecordArray, TransactionProofArray, Uint8Array];

export class ReclaimFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly proof: TransactionRecordWithProof<CloseFeeCreditPayload>,
    public readonly backlink: Uint8Array,
  ) {}

  public toOwnerProofData(): ReclaimFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): ReclaimFeeCreditAttributesArray {
    return [this.proof.transactionRecord.toArray(), this.proof.transactionProof.toArray(), this.backlink];
  }

  public toString(): string {
    return dedent`
      ReclaimFeeCreditAttributes
          ${this.proof.toString()}
          Backlink: ${Base16Converter.encode(this.backlink)}
      `;
  }
}
