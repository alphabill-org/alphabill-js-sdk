import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../TransactionRecordWithProof.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { TransferFeeCreditPayload } from './TransferFeeCreditPayload.js';

export type AddFeeCreditAttributesArray = [Uint8Array, ...TransactionRecordWithProofArray];

export class AddFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly transactionProof: TransactionRecordWithProof<TransferFeeCreditPayload>,
  ) {}

  public toOwnerProofData(): AddFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): AddFeeCreditAttributesArray {
    return [this.ownerPredicate.getBytes(), ...this.transactionProof.toArray()];
  }

  public toString(): string {
    return dedent`
      AddFeeCreditAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Transaction Proof: ${this.transactionProof.toString()}`;
  }
}
