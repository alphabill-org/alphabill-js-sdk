import { PredicateBytes } from '../PredicateBytes.js';
import { TransactionRecordWithProof, TransactionRecordWithProofArray } from '../TransactionRecordWithProof.js';
import { dedent } from '../util/StringUtils.js';
import { IPredicate } from './IPredicate.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { PayloadAttribute } from './PayloadAttribute.js';
import { TransactionPayload } from './TransactionPayload.js';
import { TransferFeeCreditAttributes } from './TransferFeeCreditAttributes.js';

export type AddFeeCreditAttributesArray = [Uint8Array, ...TransactionRecordWithProofArray];

const PAYLOAD_TYPE = 'addFC';

@PayloadAttribute(PAYLOAD_TYPE)
export class AddFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly transactionProof: TransactionRecordWithProof<TransactionPayload<TransferFeeCreditAttributes>>,
  ) {}

  public get payloadType(): string {
    return PAYLOAD_TYPE;
  }

  public toOwnerProofData(): AddFeeCreditAttributesArray {
    return this.toArray();
  }

  public toArray(): AddFeeCreditAttributesArray {
    const proof = this.transactionProof.toArray();
    return [this.ownerPredicate.bytes, ...proof];
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
