export interface ITransactionPayloadAttributes {
  toOwnerProofData(): ReadonlyArray<unknown>;
  toArray(): ReadonlyArray<unknown>;
}
