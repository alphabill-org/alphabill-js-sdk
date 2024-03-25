import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { IPredicate } from './IPredicate.js';
import { TransactionProof } from '../TransactionProof.js';

export class SwapBillsWithDustCollectorAttributes implements ITransactionPayloadAttributes {
  public constructor(
    public readonly ownerPredicate: IPredicate,
    public readonly proofs: ReadonlyArray<TransactionProof>,
    public readonly targetValue: bigint,
  ) {}

  public toOwnerProofData(): ReadonlyArray<unknown> {
    return this.toArray();
  }

  public toArray(): ReadonlyArray<unknown> {
    return [
      this.ownerPredicate.getBytes(),
      this.proofs.map((proof) => proof.transactionRecord),
      this.proofs.map((proof) => proof.transactionProof),
      this.targetValue,
    ];
  }
}
