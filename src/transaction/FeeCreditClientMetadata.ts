import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';

export class FeeCreditClientMetadata implements ITransactionClientMetadata {
  // Currently always null in backend
  public readonly feeCreditRecordId = null;

  public constructor(
    public readonly maxTransactionFee: bigint,
    public readonly timeout: bigint,
  ) {
    this.maxTransactionFee = BigInt(this.maxTransactionFee);
    this.timeout = BigInt(this.timeout);
  }
}
