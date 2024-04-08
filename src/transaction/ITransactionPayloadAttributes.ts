export interface ITransactionPayloadAttributes {
  get payloadType(): string;
  toOwnerProofData(): readonly unknown[];
  toArray(): readonly unknown[];
}
