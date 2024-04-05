export interface ITransactionPayloadAttributes {
  toOwnerProofData(): readonly unknown[];
  toArray(): readonly unknown[];
}
