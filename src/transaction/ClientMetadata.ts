import { IUnitId } from '../IUnitId.js';
import { UnitId } from '../UnitId.js';
import { ITransactionClientMetadata } from './ITransactionClientMetadata.js';

export type TransactionClientMetadataArray = [bigint, bigint, Uint8Array | null, Uint8Array | null];

export class ClientMetadata {
  public static create(
    timeout: bigint,
    maxTransactionFee: bigint,
    feeCreditRecordId: IUnitId | null,
    referenceNumber: Uint8Array | null,
  ): ITransactionClientMetadata {
    return {
      timeout: BigInt(timeout),
      maxTransactionFee: BigInt(maxTransactionFee),
      feeCreditRecordId,
      referenceNumber: referenceNumber ? new Uint8Array(referenceNumber) : null,
    };
  }

  public static encode({
    timeout,
    maxTransactionFee,
    feeCreditRecordId,
    referenceNumber,
  }: ITransactionClientMetadata): TransactionClientMetadataArray {
    return [
      timeout,
      maxTransactionFee,
      feeCreditRecordId?.bytes ?? null,
      referenceNumber ? new Uint8Array(referenceNumber) : null,
    ];
  }

  public static fromArray([
    timeout,
    maxTransactionFee,
    feeCreditRecordId,
    referenceNumber,
  ]: TransactionClientMetadataArray): ITransactionClientMetadata {
    return ClientMetadata.create(
      timeout,
      maxTransactionFee,
      feeCreditRecordId ? UnitId.fromBytes(feeCreditRecordId) : null,
      referenceNumber,
    );
  }
}
