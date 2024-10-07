import { UnitId } from '../../UnitId.js';
import { ITransactionClientMetadata } from '../ITransactionClientMetadata.js';
import { TransactionClientMetadataArray } from '../order/TransactionClientMetadataArray.js';

export class ClientMetadataSerializer {
  public static fromArray([
    timeout,
    maxTransactionFee,
    feeCreditRecordId,
    referenceNumber,
  ]: TransactionClientMetadataArray): ITransactionClientMetadata {
    return {
      timeout,
      maxTransactionFee,
      feeCreditRecordId: feeCreditRecordId ? UnitId.fromBytes(feeCreditRecordId) : null,
      referenceNumber,
    };
  }

  public static toArray({
    timeout,
    maxTransactionFee,
    feeCreditRecordId,
    referenceNumber,
  }: ITransactionClientMetadata): TransactionClientMetadataArray {
    return [timeout, maxTransactionFee, feeCreditRecordId?.bytes ?? null, referenceNumber];
  }
}
