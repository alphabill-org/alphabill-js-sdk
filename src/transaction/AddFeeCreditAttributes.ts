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
        Transaction Proof: 
          ${this.transactionProof.toString()}`;
  }

  public static FromArray(data: AddFeeCreditAttributesArray): AddFeeCreditAttributes {
    return new AddFeeCreditAttributes(
      new PredicateBytes(new Uint8Array(data[0])),
      TransactionRecordWithProof.FromArray([data[1], data[2]]),
    );
  }
}
