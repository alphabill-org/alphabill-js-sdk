import dedent from 'dedent';
import { TransactionProofArray } from '../TransactionProof.js';
import { TransactionRecordArray } from '../TransactionRecord.js';
import { TransactionRecordWithProof } from '../TransactionRecordWithProof.js';
import { Base16Converter } from '../util/Base16Converter.js';
import { CloseFeeCreditAttributes } from './CloseFeeCreditAttributes.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadType } from './PayloadAttributeFactory.js';
import { TransactionPayload } from './TransactionPayload.js';

export type ReclaimFeeCreditAttributesArray = [TransactionRecordArray, TransactionProofArray, Uint8Array];

export class ReclaimFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly proof: TransactionRecordWithProof<TransactionPayload<CloseFeeCreditAttributes>>,
    private readonly _backlink: Uint8Array,
  ) {
    this._backlink = new Uint8Array(this._backlink);
  }

  public get payloadType(): PayloadType {
    return PayloadType.ReclaimFeeCreditAttributes;
  }

  public get backlink(): Uint8Array {
    return new Uint8Array(this._backlink);
  }

  public toOwnerProofData(): ReclaimFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): ReclaimFeeCreditAttributesArray {
    return [this.proof.transactionRecord.toArray(), this.proof.transactionProof.toArray(), this.backlink];
  }

  public toString(): string {
    return dedent`
      ReclaimFeeCreditAttributes
        Transaction Proof: 
          ${this.proof.toString()}
        Backlink: ${Base16Converter.encode(this._backlink)}
      `;
  }

  public static fromArray(data: ReclaimFeeCreditAttributesArray): ReclaimFeeCreditAttributes {
    return new ReclaimFeeCreditAttributes(TransactionRecordWithProof.fromArray([data[0], data[1]]), data[2]);
  }
}
