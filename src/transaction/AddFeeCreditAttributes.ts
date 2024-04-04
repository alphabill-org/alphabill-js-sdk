import { PredicateBytes } from '../PredicateBytes.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../TransactionRecordWithProof.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';
import { TransferFeeCreditPayload } from './TransferFeeCreditPayload.js';

export type AddFeeCreditAttributesArray = [Uint8Array, ...TransactionRecordWithProofArray];

@PayloadAttribute
export class AddFeeCreditAttributes implements ITransactionPayloadAttributes {
  public static get PAYLOAD_TYPE(): string {
    return 'addFC';
  }

  public constructor(
    private readonly ownerPredicate: IPredicate,
    private readonly transactionProof: TransactionRecordWithProof<TransferFeeCreditPayload>,
  ) {}

  public getOwnerPredicate(): IPredicate {
    return this.ownerPredicate;
  }

  public getTransactionProof(): TransactionRecordWithProof<TransferFeeCreditPayload> {
    return this.transactionProof;
  }

  public toOwnerProofData(): AddFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): AddFeeCreditAttributesArray {
    const proof = this.transactionProof.toArray();
    return [this.getOwnerPredicate().getBytes(), ...proof];
  }

  public toString(): string {
    return dedent`
      AddFeeCreditAttributes
        Owner Predicate: ${this.ownerPredicate.toString()}
        Transaction Proof: 
          ${this.transactionProof.toString()}`;
  }

  public static fromArray(data: AddFeeCreditAttributesArray): AddFeeCreditAttributes {
    return new AddFeeCreditAttributes(
      new PredicateBytes(data[0]),
      TransactionRecordWithProof.fromArray([data[1], data[2]]),
    );
  }
}
