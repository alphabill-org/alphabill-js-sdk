export class TransactionProof {
  public constructor(
    public readonly transactionRecord: unknown,
    public readonly transactionProof: unknown,
  ) {}

  public toArray(): ReadonlyArray<unknown> {
    return [this.transactionRecord, this.transactionProof];
  }
}
