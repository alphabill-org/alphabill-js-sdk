import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { IPredicate } from './IPredicate.js';
import { TransactionProof } from '../TransactionProof.js';

export class AddFeeCreditAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly transactionProof: TransactionProof,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [this.ownerPredicate.getBytes(), ...this.transactionProof.toArray()];
  }
}
