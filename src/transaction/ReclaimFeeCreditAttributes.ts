import dedent from 'dedent';
import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { CloseFeeCreditPayload } from './CloseFeeCreditPayload.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';

export type ReclaimFeeCreditAttributesArray = [TransactionRecordArray, TransactionProofArray, Uint8Array];

@PayloadAttribute
export class ReclaimFeeCreditAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'reclFC';
  }

  public constructor(
    public readonly proof: TransactionRecordWithProof<CloseFeeCreditPayload>,
    public readonly backlink: Uint8Array,
  ) {
    this.backlink = new Uint8Array(this.backlink);
  }

  public toOwnerProofData(): ReclaimFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): ReclaimFeeCreditAttributesArray {
    return [
      this.proof.transactionRecord.toArray(),
      this.proof.transactionProof.toArray(),
      new Uint8Array(this.backlink),
    ];
  }

  public toString(): string {
    return dedent`
      ReclaimFeeCreditAttributes
        Transaction Proof: 
          ${this.proof.toString()}
        Backlink: ${Base16Converter.encode(this.backlink)}
      `;
  }

  public static fromArray(data: ReclaimFeeCreditAttributesArray): ReclaimFeeCreditAttributes {
    return new ReclaimFeeCreditAttributes(TransactionRecordWithProof.fromArray([data[0], data[1]]), data[2]);
  }
}
