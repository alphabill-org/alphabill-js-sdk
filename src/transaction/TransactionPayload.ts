import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';
import { ITransactionPayloadAttributes } from './ITransactionPayloadAttributes.js';
import { IUnitId } from '../IUnitId.js';

export class TransactionPayload<T extends ITransactionPayloadAttributes> {
  public constructor(
    public readonly type: string,
    public readonly systemIdentifier: number,
    public readonly unitId: IUnitId,
    public readonly attributes: T,
    public readonly clientMetadata: ITransactionClientMetadata,
  ) {}

  public getSigningFields(): ReadonlyArray<unknown> {
    return [
      this.systemIdentifier,
      this.type,
      this.unitId.getBytes(),
      this.attributes.toOwnerProofData(),
      [this.clientMetadata.timeout, this.clientMetadata.maxTransactionFee, this.clientMetadata.feeCreditRecordId?.getBytes()],
    ];
  }

  public toArray(): unknown[] {
    return [
      this.systemIdentifier,
      this.type,
      this.unitId.getBytes(),
      this.attributes.toArray(),
      [this.clientMetadata.timeout, this.clientMetadata.maxTransactionFee, this.clientMetadata.feeCreditRecordId?.getBytes()],
    ];
  }
}
